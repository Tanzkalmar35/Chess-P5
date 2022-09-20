function PIECEINDEX(piece, pieceNum) {
    return (piece * 10 + pieceNum);
}

var gameBoard = {};

gameBoard.pieces = new Array(boardSquareNumber); // array for the pieces
gameBoard.side = COLOURS.WHITE; // the side you are playing
gameBoard.fiftyMove = 0; // after 50 moves made without pawn move or capture, players can draw. -> increasing it with every move and tracking if it hits 50
gameBoard.hisPly = 0; // count of every move made in the game
gameBoard.history = []; // the move history
gameBoard.ply = 0; // number of half moves made in the search tree
gameBoard.enPassant = 0; // number for en passant squares

/** Castling permissions in binary
 * We are creating a binary number of 4 digits, meaning a 4 digit number with only 0s and 1s.
 * every 1 in this number represents a castle right, which one depends on which of the 4 digits is the one, as shown below
 * 
 * 0001: white kingsite castle
 * 0010: white queensite castle
 * 0100: black kingsite castle
 * 1000: black queensite castle
 * 
 */
gameBoard.castlePerm = 0; // permissions if the player is allowed to castle
gameBoard.material = new Array(2); // WHITE OR BLACK MATERIAL
gameBoard.pieceNumber = new Array(13); // an array list of 
gameBoard.pieceList = new Array(14 * 10); // an array list of all pieces
gameBoard.positionKey = 0; // a number representing the position on the board

gameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
gameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
gameBoard.moveListStart = new Array(MAXDEPTH);

gameBoard.pvTable = [];
gameBoard.pvArray = new Array(MAXDEPTH);
gameBoard.searchHistory = new Array(14 * boardSquareNumber);
gameBoard.searchKillers = new Array(3 * MAXDEPTH);

//checks for the board if everything is alright and throws errors if not
function checkBoard() {

    var temporaryTargetPieceNumber = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    var targetMaterial = [ 0, 0 ];
    var Square64, targetPiece, targetPieceNumber, Square120, colour, pieceCount;

    for (targetPiece = PIECES.wP; targetPiece < PIECES.bK; targetPiece++) {
        for (targetPieceNumber = 0; targetPieceNumber < gameBoard.pieceNumber[targetPiece]; targetPieceNumber++) {
            Square120 = gameBoard.pieceList[PIECEINDEX(targetPiece, targetPieceNumber)];
            if (gameBoard.pieces[Square120] != targetPiece) {
                console.log("Error piece Lists");
                return BOOL.FALSE;
            }
        }
    }

    for (Square64 = 0; Square64 < 64; Square64++) {
        Square120 = square120(Square64);
        targetPiece = gameBoard.pieces[Square120];
        temporaryTargetPieceNumber[targetPiece]++;
        targetMaterial[PieceCol[targetPiece]] += PieceVal[targetPiece];
    }

    for (targetPiece = PIECES.wP; targetPiece <= PIECES.bK; targetPiece++) {
        if (temporaryTargetPieceNumber[targetPiece] != gameBoard.pieceNumber[targetPiece]) {
            console.log("Error temporaryTargetPieceNumber");
            return BOOL.FALSE;
        }
    }

    if (targetMaterial[COLOURS.WHITE] != gameBoard.material[COLOURS.WHITE] || 
        targetMaterial[COLOURS.BLACK] != gameBoard.material[COLOURS.BLACK]) {
            console.log("Error targetMaterial");
            return BOOL.FALSE;
    }

    if (gameBoard.side != COLOURS.WHITE && gameBoard.side != COLOURS.BLACK) {
        console.log("Error gameBoard.side");
    }

    if (generatePositionKey() != gameBoard.positionKey) {
        //console.log("Error gameBoard.positionKey");
        return BOOL.FALSE;
    }
    return BOOL.TRUE;
}

//prints the current board to the console
function printBoardToConsole() {
    var square, file, rank, piece;

    console.log("\nGame Board\n");

    for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
        var line = (RankChar[rank] + "");
        for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
            square = getSquareOutOfFileAndRank(file, rank);
            piece = gameBoard.pieces[square];
            line += (" " + pieceChar[piece] + " ");
        }
        console.log(line);
    }
    var line = " ";
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
        line += (' ' + FileChar[file] + ' ');
    }

    console.log(line);
    console.log("side: " + sideChar[gameBoard.side]);
    console.log("enPassant: " + gameBoard.enPassant);
    line = "";

    if (gameBoard.castlePerm & CASTLEBIT.WKCA) line += "K";
    if (gameBoard.castlePerm & CASTLEBIT.WQCA) line += "Q";
    if (gameBoard.castlePerm & CASTLEBIT.BKCA) line += "k";
    if (gameBoard.castlePerm & CASTLEBIT.BQCA) line += "q";

    console.log("castle: " + line);
    console.log("key: " + gameBoard.positionKey.toString(16));

}

function generatePositionKey() {

    var square = 0;
    var finalKey = 0;
    var piece = PIECES.EMPTY;

    for (square = 0; square < boardSquareNumber; square++) {
        piece = gameBoard.pieces[square];
        if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
            finalKey ^= pieceKeys[(piece * 120) + square];
        }
    }

    if (gameBoard.side == COLOURS.WHITE) {
        finalKey ^= sideKey;
    }

    if (gameBoard.enPassant != SQUARES.NO_SQ) {
        finalKey ^= pieceKeys[gameBoard.enPassant];
    }

    finalKey ^= castleKeys[gameBoard.castlePerm];

    return finalKey;

}

//prints the piece list
function printPieceLists() {
    var piece, pieceNum;

    for (piece = PIECES.wP; piece <= PIECES.bK; piece++) {
        for (pieceNum = 0; pieceNum < gameBoard.pieceNumber[piece]; ++pieceNum) {
            console.log("Piece " + pieceChar[piece] + " on " + printSquare(gameBoard.pieceList[PIECEINDEX(piece, pieceNum)]));
        }
    }
}

//updates the material on the board
function updateListsMaterial() {

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
		sq = square120(index);
		piece = gameBoard.pieces[sq];
		if(piece != PIECES.EMPTY) {
			//console.log('piece ' + piece + ' on ' + sq);
			colour = PieceCol[piece];		
			
			gameBoard.material[colour] += PieceVal[piece];
			
			gameBoard.pieceList[PIECEINDEX(piece, gameBoard.pieceNumber[piece])] = sq;
			gameBoard.pieceNumber[piece]++;			
		}
	}
    printPieceLists();
}

//simply resets the board
function resetBoard() {

    
    for (var i = 0; i < boardSquareNumber; i++) {
        gameBoard.pieces[i] = SQUARES.OFFBOARD;
    }

    for (var i = 0; i < 13; i++) {
        gameBoard.pieceNumber[i] = 0;
    }

    gameBoard.side = COLOURS.BOTH;
    gameBoard.enPassant = SQUARES.NO_SQ;
    gameBoard.fiftyMove = 0;
    gameBoard.ply = 0;
    gameBoard.hisPly = 0;
    gameBoard.castlePerm = 0;
    gameBoard.posKey = 0;
    gameBoard.moveListStart[gameBoard.ply] = 0;

}

//breaks the fen down and translates it into a board position
function parseFen(fen) {

    resetBoard();

    var rank = RANKS.RANK_8;
    var file = FILES.FILE_A;
    var piece = 0;
    var count = 0;
    var i = 0;
    var square120 = 0;
    var fenDigitCount = 0;

    while ((rank >= RANKS.RANK_1) && fenDigitCount < fen.length) {
        count = 1;
        switch (fen[fenDigitCount]) {
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
                count = fen[fenDigitCount].charCodeAt() - '0'.charCodeAt();
                break;
            
            case '/':
            case ' ':
                rank--;
                file = FILES.FILE_A;
                fenDigitCount++;
                continue;  
            default:
                console.log("FEN error");
                return;
        }
        for (var i = 0; i < count; i++) {
            square120 = getSquareOutOfFileAndRank(file, rank);
            gameBoard.pieces[square120] = piece;
            file++;
        }
        fenDigitCount++;
    }

    gameBoard.side = (fen[fenDigitCount] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
    fenDigitCount += 2;

    for (var i = 0; i < 4; i++) {
        if (fen[fenDigitCount] == " ") {
            break;
        }
        switch (fen[fenDigitCount]) {
            case "K" : gameBoard.castlePerm |= CASTLEBIT.WKCA; break;
            case "Q" : gameBoard.castlePerm |= CASTLEBIT.WQCA; break;
            case "k" : gameBoard.castlePerm |= CASTLEBIT.BKCA; break;
            case "q" : gameBoard.castlePerm |= CASTLEBIT.BQCA; break;

            default:
                break;
        }
        fenDigitCount++;
    }
    fenDigitCount++;

    if (fen[fenDigitCount] != "-") {
        file = fen[fenDigitCount].charCodeAt() - "a".charCodeAt();
        rank = fen[fenDigitCount + 1].charCodeAt() - "1".charCodeAt();
        console.log("fen[fenDigitCount]: " + fen[fenDigitCount] + " File: " + file + " Rank: " + rank);
        gameBoard.enPassant = getSquareOutOfFileAndRank(file, rank);
    }
    gameBoard.positionKey = generatePositionKey();
    updateListsMaterial();
    printSquareAttacked();
}

//prints out a board, where all squares attacked are highlighted 
function printSquareAttacked() {
    var square, file, rank, piece;

    console.log("\nAttacked\n");

    for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
        var line = ((rank + 1) + "  ");
        for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
            square = getSquareOutOfFileAndRank(file, rank);
            if (squareAttacked(square, gameBoard.side) == BOOL.TRUE) {
                piece = "X";
            } else {
                piece = "-";
            }
            line += (" " + piece + " ");
        }
        console.log(line);
    }
}

//this function checks for the squares attacked on the board
function squareAttacked(square, side) {
    var piece;
    var targetSquare;

    // calculating the squares attacked by pawns (black and white side)
    if (side == COLOURS.WHITE) {
        if (gameBoard.pieces[square - 11] == PIECES.wP || gameBoard.pieces[square - 9] == PIECES.wP) {
            return BOOL.TRUE;
        }
    } else {
        if (gameBoard.pieces[square + 11] == PIECES.bP || gameBoard.pieces[square + 9] == PIECES.bP) {
            return BOOL.TRUE;
        }
    }

    //calculating the squares attacked by knight
    for (var i = 0; i < 8; i++) {
        piece = gameBoard.pieces[square + knightDir[i]];
        if (piece != SQUARES.OFFBOARD && PieceCol[piece] == side && PieceKnight[piece] == BOOL.TRUE) {
            return BOOL.TRUE;
        }
    }

    //calculating the squares attacked by rook
    for (var i = 0; i < 4; i++) {
        dir = rookDir[i];
        targetSquare = square + dir;
        piece = gameBoard.pieces[targetSquare];
        while (piece != SQUARES.OFFBOARD) {
            if (piece != PIECES.EMPTY) {
                if (PieceRookQueen[piece] == BOOL.TRUE && PieceCol[piece] == side) {
                    return BOOL.TRUE;
                }
                break;
            }
            targetSquare += dir;
            piece = gameBoard.pieces[targetSquare];
        }
    }

    //calculating the squares attacked by bishop
    for (var i = 0; i < 4; i++) {
        dir = bishopDir[i];
        targetSquare = square + dir;
        piece = gameBoard.pieces[targetSquare];
        while (piece != SQUARES.OFFBOARD) {
            if (piece != PIECES.EMPTY) {
                if (PieceBishopQueen[piece] == BOOL.TRUE && PieceCol[piece] == side) {
                    return BOOL.TRUE;
                }
                break;
            }
            targetSquare += dir;
            piece = gameBoard.pieces[targetSquare];
        }
    }

    //calculating the squares attacked by king
    for (var i = 0; i < 8; i++) {
        piece = gameBoard.pieces[square + kingDir[i]];
        if (piece != SQUARES.OFFBOARD && PieceCol[piece] == side && PieceKing[piece] == BOOL.TRUE) {
            return BOOL.TRUE;
        }
    }

    return BOOL.FALSE;

}
