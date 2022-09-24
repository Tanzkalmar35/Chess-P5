
function PIECEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

var gameBoard = {};

gameBoard.pieces = new Array(boardSquareNumber);
gameBoard.side = COLOURS.WHITE;
gameBoard.fiftyMove = 0;
gameBoard.hisPly = 0;
gameBoard.history = [];
gameBoard.ply = 0;
gameBoard.enPassant = 0;
gameBoard.castlePerm = 0;
gameBoard.material = new Array(2); // WHITE,BLACK material of pieces
gameBoard.pieceNumber = new Array(13); // indexed by Pce
gameBoard.pieceList = new Array(14 * 10);
gameBoard.positionKey = 0;
gameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
gameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
gameBoard.moveListStart = new Array(MAXDEPTH);
gameBoard.pvTable = [];
gameBoard.pvArray = new Array(MAXDEPTH);
gameBoard.searchHistory = new Array( 14 * boardSquareNumber);
gameBoard.searchKillers = new Array(3 * MAXDEPTH);



function checkBoard() {   
 
	var targetPieceNumber = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var targetMaterial = [ 0, 0];
	var sq64, targetPiece, targetPieceNum, sq120, colour, pieceCount;
	
	for(targetPiece = PIECES.wP; targetPiece <= PIECES.bK; ++targetPiece) {
		for(targetPieceNum = 0; targetPieceNum < gameBoard.pieceNumber[targetPiece]; ++targetPieceNum) {
			sq120 = gameBoard.pieceList[PIECEINDEX(targetPiece,targetPieceNum)];
			if(gameBoard.pieces[sq120] != targetPiece) {
				console.log('Error Pce Lists');
				return BOOL.FALSE;
			}
		}	
	}
	
	for(sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64);
		targetPiece = gameBoard.pieces[sq120];
		targetPieceNumber[targetPiece]++;
		targetMaterial[pieceCol[targetPiece]] += pieceVal[targetPiece];
	}
	
	for(targetPiece = PIECES.wP; targetPiece <= PIECES.bK; ++targetPiece) {
		if(targetPieceNumber[targetPiece] != gameBoard.pieceNumber[targetPiece]) {
				console.log('Error targetPieceNumber');
				return BOOL.FALSE;
			}	
	}
	
	if(targetMaterial[COLOURS.WHITE] != gameBoard.material[COLOURS.WHITE] ||
			 targetMaterial[COLOURS.BLACK] != gameBoard.material[COLOURS.BLACK]) {
				console.log('Error targetMaterial');
				return BOOL.FALSE;
	}	
	
	if(gameBoard.side!=COLOURS.WHITE && gameBoard.side!=COLOURS.BLACK) {
				console.log('Error gameBoard.side');
				return BOOL.FALSE;
	}
	
	if(generatePosKey()!=gameBoard.positionKey) {
				console.log('Error gameBoard.posKey');
				return BOOL.FALSE;
	}	
	return BOOL.TRUE;
}

function printBoard() {
	
	var square,file,rank,piece;

	console.log("\nGame Board:\n");
	for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		var line =(rankChar[rank] + "  ");
		for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			square = fileAndRankToSquare(file,rank);
			piece = gameBoard.pieces[square];
			line += (" " + pieceChar[piece] + " ");
		}
		console.log(line);
	}
	
	console.log("");
	var line = "   ";
	for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
		line += (' ' + fileChar[file] + ' ');	
	}
	
	console.log(line);
	console.log("side:" + sideChar[gameBoard.side] );
	console.log("enPassant:" + gameBoard.enPassant);
	line = "";	
	
	if(gameBoard.castlePerm & CASTLEBIT.WKCA) line += 'K';
	if(gameBoard.castlePerm & CASTLEBIT.WQCA) line += 'Q';
	if(gameBoard.castlePerm & CASTLEBIT.BKCA) line += 'k';
	if(gameBoard.castlePerm & CASTLEBIT.BQCA) line += 'q';
	console.log("castle:" + line);
	console.log("key:" + gameBoard.positionKey.toString(16));
}

function generatePosKey() {

	var square = 0;
	var finalKey = 0;
	var piece = PIECES.EMPTY;

	for(square = 0; square < boardSquareNumber; ++square) {
		piece = gameBoard.pieces[square];
		if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {			
			finalKey ^= pieceKeys[(piece * 120) + square];
		}		
	}

	if(gameBoard.side == COLOURS.WHITE) {
		finalKey ^= sideKey;
	}
	
	if(gameBoard.enPassant != SQUARES.NO_SQ) {		
		finalKey ^= pieceKeys[gameBoard.enPassant];
	}
	
	finalKey ^= castleKeys[gameBoard.castlePerm];
	
	return finalKey;

}

function printPieceLists() {

	var piece, pieceNumber;
	
	for(piece = PIECES.wP; piece <= PIECES.bK; ++piece) {
		for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
			console.log('Piece ' + pieceChar[piece] + ' on ' + printSquare( gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)] ));
		}
	}

}

function UpdateListsMaterial() {	
	
	var piece,sq,index,colour;
	
	for(index = 0; index < 14 * 120; ++index) {
		gameBoard.pieceList[index] = PIECES.EMPTY;
	}
	
	for(index = 0; index < 2; ++index) {		
		gameBoard.material[index] = 0;		
	}	
	
	for(index = 0; index < 13; ++index) {
		gameBoard.pieceNumber[index] = 0;
	}
	
	for(index = 0; index < 64; ++index) {
		sq = SQ120(index);
		piece = gameBoard.pieces[sq];
		if(piece != PIECES.EMPTY) {
			
			colour = pieceCol[piece];		
			
			gameBoard.material[colour] += pieceVal[piece];
			
			gameBoard.pieceList[PIECEINDEX(piece,gameBoard.pieceNumber[piece])] = sq;
			gameBoard.pieceNumber[piece]++;			
		}
	}
	
	printPieceLists();
	
}

function ResetBoard() {
	
	var index = 0;
	
	for(index = 0; index < boardSquareNumber; ++index) {
		gameBoard.pieces[index] = SQUARES.OFFBOARD;
	}
	
	for(index = 0; index < 64; ++index) {
		gameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
	}
	
	gameBoard.side = COLOURS.BOTH;
	gameBoard.enPassant = SQUARES.NO_SQ;
	gameBoard.fiftyMove = 0;	
	gameBoard.ply = 0;
	gameBoard.hisPly = 0;	
	gameBoard.castlePerm = 0;	
	gameBoard.positionKey = 0;
	gameBoard.moveListStart[gameBoard.ply] = 0;
	
}

//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

function ParseFen(fen) {

	ResetBoard();
	
	var rank = RANKS.RANK_8;
    var file = FILES.FILE_A;
    var piece = 0;
    var count = 0;
    var i = 0;  
	var sq120 = 0;
	var fenCnt = 0; // fen[fenCnt]
	
	while ((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
	    count = 1;
		switch (fen[fenCnt]) {
			case 'p': piece = PIECES.bP; break;
            case 'r': piece = PIECES.bR; break;
            case 'n': piece = PIECES.bN; break;
            case 'b': piece = PIECES.bB; break;
            case 'k': piece = PIECES.bK; break;
            case 'q': piece = PIECES.bQ; break;
            case 'P': piece = PIECES.wP; break;
            case 'R': piece = PIECES.wR; break;
            case 'N': piece = PIECES.wN; break;
            case 'B': piece = PIECES.wB; break;
            case 'K': piece = PIECES.wK; break;
            case 'Q': piece = PIECES.wQ; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = PIECES.EMPTY;
                count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                break;
            
            case '/':
            case ' ':
                rank--;
                file = FILES.FILE_A;
                fenCnt++;
                continue;  
            default:
                console.log("FEN error");
                return;

		}
		
		for (i = 0; i < count; i++) {	
			sq120 = fileAndRankToSquare(file,rank);            
            gameBoard.pieces[sq120] = piece;
			file++;
        }
		fenCnt++;
	} // while loop end
	
	//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
	gameBoard.side = (fen[fenCnt] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
	fenCnt += 2;
	
	for (i = 0; i < 4; i++) {
        if (fen[fenCnt] == ' ') {
            break;
        }		
		switch(fen[fenCnt]) {
			case 'K': gameBoard.castlePerm |= CASTLEBIT.WKCA; break;
			case 'Q': gameBoard.castlePerm |= CASTLEBIT.WQCA; break;
			case 'k': gameBoard.castlePerm |= CASTLEBIT.BKCA; break;
			case 'q': gameBoard.castlePerm |= CASTLEBIT.BQCA; break;
			default:	     break;
        }
		fenCnt++;
	}
	fenCnt++;	
	
	if (fen[fenCnt] != '-') {        
		file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
		rank = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt();	
		console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);	
		gameBoard.enPassant = fileAndRankToSquare(file,rank);		
    }
	
	gameBoard.positionKey = generatePosKey();	
	UpdateListsMaterial();
	PrintSqAttacked();
}

function PrintSqAttacked() {
	
	var sq,file,rank,piece;

	console.log("\nAttacked:\n");
	
	for(rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		var line =((rank+1) + "  ");
		for(file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = fileAndRankToSquare(file,rank);
			if(SquareAttacked(sq, gameBoard.side^1) == BOOL.TRUE) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		console.log(line);
	}
	
	console.log("");
	
}

function SquareAttacked(sq, side) {
	var pce;
	var t_sq;
	var index;
	
	if(side == COLOURS.WHITE) {
		if(gameBoard.pieces[sq - 11] == PIECES.wP || gameBoard.pieces[sq - 9] == PIECES.wP) {
			return BOOL.TRUE;
		}
	} else {
		if(gameBoard.pieces[sq + 11] == PIECES.bP || gameBoard.pieces[sq + 9] == PIECES.bP) {
			return BOOL.TRUE;
		}	
	}
	
	for(index = 0; index < 8; index++) {
		pce = gameBoard.pieces[sq + knightDirection[index]];
		if(pce != SQUARES.OFFBOARD && pieceCol[pce] == side && pieceKnight[pce] == BOOL.TRUE) {
			return BOOL.TRUE;
		}
	}
	
	for(index = 0; index < 4; ++index) {		
		dir = rookDirection[index];
		t_sq = sq + dir;
		pce = gameBoard.pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(pieceRookQueen[pce] == BOOL.TRUE && pieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = gameBoard.pieces[t_sq];
		}
	}
	
	for(index = 0; index < 4; ++index) {		
		dir = bishopDirection[index];
		t_sq = sq + dir;
		pce = gameBoard.pieces[t_sq];
		while(pce != SQUARES.OFFBOARD) {
			if(pce != PIECES.EMPTY) {
				if(pieceBishopQueen[pce] == BOOL.TRUE && pieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = gameBoard.pieces[t_sq];
		}
	}
	
	for(index = 0; index < 8; index++) {
		pce = gameBoard.pieces[sq + kingDirection[index]];
		if(pce != SQUARES.OFFBOARD && pieceCol[pce] == side && pieceKing[pce] == BOOL.TRUE) {
			return BOOL.TRUE;
		}
	}
	
	return BOOL.FALSE;
	

}





































































