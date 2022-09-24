function clearPiece(square) {

	var piece = gameBoard.pieces[square];
	var column = pieceCol[piece];
	var targetPieceNumber = -1;
	
	HASH_PIECE(piece, square);
	
	gameBoard.pieces[square] = PIECES.EMPTY;
	gameBoard.material[column] -= pieceVal[piece];
	
	for(var i = 0; i < gameBoard.pieceNumber[piece]; ++i) {
		if(gameBoard.pieceList[PIECEINDEX(piece,i)] == square) {
			targetPieceNumber = i;
			break;
		}
	}
	
	gameBoard.pieceNumber[piece]--;
	gameBoard.pieceList[PIECEINDEX(piece, targetPieceNumber)] = gameBoard.pieceList[PIECEINDEX(piece, gameBoard.pieceNumber[piece])];	

}

function addPiece(square, piece) {

	var column = pieceCol[piece];
	
	HASH_PIECE(piece, square);
	
	gameBoard.pieces[square] = piece;
	gameBoard.material[column] += pieceVal[piece];
	gameBoard.pieceList[PIECEINDEX(piece, gameBoard.pieceNumber[piece])] = square;
	gameBoard.pieceNumber[piece]++;

}

function movePiece(fromSquare, toSquare) {
	
	var piece = gameBoard.pieces[fromSquare];
	
	HASH_PIECE(piece, fromSquare);
	gameBoard.pieces[fromSquare] = PIECES.EMPTY;
	
	HASH_PIECE(piece,toSquare);
	gameBoard.pieces[toSquare] = piece;
	
	for(var i = 0; i < gameBoard.pieceNumber[piece]; ++i) {
		if(gameBoard.pieceList[PIECEINDEX(piece,i)] == fromSquare) {
			gameBoard.pieceList[PIECEINDEX(piece,i)] = toSquare;
			break;
		}
	}
	
}

function makeMove(move) {
	
	var fromSquare = FROMSQ(move);
    var toSquare = TOSQ(move);
    var side = gameBoard.side;	

	gameBoard.history[gameBoard.hisPly].posKey = gameBoard.positionKey;

	if( (move & moveFlagEnPassant) != 0) {
		if(side == COLOURS.WHITE) {
			clearPiece(toSquare-10);
		} else {
			clearPiece(toSquare+10);
		}
	} else if( (move & moveFlagCastle) != 0) {
		switch(toSquare) {
			case SQUARES.C1:
                movePiece(SQUARES.A1, SQUARES.D1);
			break;
            case SQUARES.C8:
                movePiece(SQUARES.A8, SQUARES.D8);
			break;
            case SQUARES.G1:
                movePiece(SQUARES.H1, SQUARES.F1);
			break;
            case SQUARES.G8:
                movePiece(SQUARES.H8, SQUARES.F8);
			break;
            default: break;
		}
	}
	
	if(gameBoard.enPassant != SQUARES.NO_SQ) HASH_ENPASSANT();
	HASH_CASTLE();
	
	gameBoard.history[gameBoard.hisPly].move = move;
    gameBoard.history[gameBoard.hisPly].fiftyMove = gameBoard.fiftyMove;
    gameBoard.history[gameBoard.hisPly].enPas = gameBoard.enPassant;
    gameBoard.history[gameBoard.hisPly].castlePerm = gameBoard.castlePerm;
    
    gameBoard.castlePerm &= castlePerm[fromSquare];
    gameBoard.castlePerm &= castlePerm[toSquare];
    gameBoard.enPassant = SQUARES.NO_SQ;
    
    HASH_CASTLE();
    
    var captured = CAPTURED(move);
    gameBoard.fiftyMove++;
    
    if(captured != PIECES.EMPTY) {
        clearPiece(toSquare);
        gameBoard.fiftyMove = 0;
    }
    
    gameBoard.hisPly++;
	gameBoard.ply++;
	
	if(piecePawn[gameBoard.pieces[fromSquare]] == BOOL.TRUE) {
        gameBoard.fiftyMove = 0;
        if( (move & moveFlagPawnStart) != 0) {
            if(side==COLOURS.WHITE) {
                gameBoard.enPassant=fromSquare+10;
            } else {
                gameBoard.enPassant=fromSquare-10;
            }
            HASH_ENPASSANT();
        }
    }
    
    movePiece(fromSquare, toSquare);
    
    var prPce = PROMOTED(move);
    if(prPce != PIECES.EMPTY)   {       
        clearPiece(toSquare);
        addPiece(toSquare, prPce);
    }
    
    gameBoard.side ^= 1;
    HASH_SIDE();
    
    if(SquareAttacked(gameBoard.pieceList[PIECEINDEX(Kings[side],0)], gameBoard.side))  {
         takeMove();
    	return BOOL.FALSE;
    }
    
    return BOOL.TRUE;
}

function takeMove() {
	
	gameBoard.hisPly--;
    gameBoard.ply--;
    
    var move = gameBoard.history[gameBoard.hisPly].move;
	var fromSquare = FROMSQ(move);
    var toSquare = TOSQ(move);
    
    if(gameBoard.enPassant != SQUARES.NO_SQ) HASH_ENPASSANT();
    HASH_CASTLE();
    
    gameBoard.castlePerm = gameBoard.history[gameBoard.hisPly].castlePerm;
    gameBoard.fiftyMove = gameBoard.history[gameBoard.hisPly].fiftyMove;
    gameBoard.enPassant = gameBoard.history[gameBoard.hisPly].enPas;
    
    if(gameBoard.enPassant != SQUARES.NO_SQ) HASH_ENPASSANT();
    HASH_CASTLE();
    
    gameBoard.side ^= 1;
    HASH_SIDE();
    
    if( (moveFlagEnPassant & move) != 0) {
        if(gameBoard.side == COLOURS.WHITE) {
            addPiece(toSquare-10, PIECES.bP);
        } else {
            addPiece(toSquare+10, PIECES.wP);
        }
    } else if( (moveFlagCastle & move) != 0) {
        switch(toSquare) {
        	case SQUARES.C1: movePiece(SQUARES.D1, SQUARES.A1); break;
            case SQUARES.C8: movePiece(SQUARES.D8, SQUARES.A8); break;
            case SQUARES.G1: movePiece(SQUARES.F1, SQUARES.H1); break;
            case SQUARES.G8: movePiece(SQUARES.F8, SQUARES.H8); break;
            default: break;
        }
    }
    
    movePiece(toSquare, fromSquare);
    
    var captured = CAPTURED(move);
    if(captured != PIECES.EMPTY) {      
        addPiece(toSquare, captured);
    }
    
    if(PROMOTED(move) != PIECES.EMPTY)   {        
        clearPiece(fromSquare);
        addPiece(fromSquare, (pieceCol[PROMOTED(move)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP));
    }
    
}























































































