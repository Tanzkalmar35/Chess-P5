
function MOVE(from, to, captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function AddCaptureMove(move) {
	gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply+1]] = move;
	gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply+1]++] = 0;
}

function AddQuietMove(move) {
	gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply+1]] = move;
	gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply+1]++] = 0;
}

function AddEnPassantMove(move) {
	gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply+1]] = move;
	gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply+1]++] = 0;
}

function AddWhitePawnCaptureMove(from, to, cap) {
	if(ranksBoard[from]==RANKS.RANK_7) {
		AddCaptureMove(MOVE(from, to, cap, PIECES.wQ, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wR, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wB, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.wN, 0));	
	} else {
		AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));	
	}
}

function AddBlackPawnCaptureMove(from, to, cap) {
	if(ranksBoard[from]==RANKS.RANK_2) {
		AddCaptureMove(MOVE(from, to, cap, PIECES.bQ, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bR, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bB, 0));
		AddCaptureMove(MOVE(from, to, cap, PIECES.bN, 0));	
	} else {
		AddCaptureMove(MOVE(from, to, cap, PIECES.EMPTY, 0));	
	}
}

function AddWhitePawnQuietMove(from, to) {
	if(ranksBoard[from]==RANKS.RANK_7) {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wQ,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wR,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wB,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wN,0));
	} else {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.EMPTY,0));	
	}
}

function AddBlackPawnQuietMove(from, to) {
	if(ranksBoard[from]==RANKS.RANK_2) {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bQ,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bR,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bB,0));
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bN,0));
	} else {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.EMPTY,0));	
	}
}

function generateMoves() {
	gameBoard.moveListStart[gameBoard.ply+1] = gameBoard.moveListStart[gameBoard.ply];
	
	var pieceType;
	var pieceNum;
	var square;
	var pieceIndex;
	var piece;
	var targetSquare;
	var direction;
	
	if(gameBoard.side == COLOURS.WHITE) {
		pieceType = PIECES.wP;
		
		for(pieceNum = 0; pieceNum < gameBoard.pieceNumber[pieceType]; ++pieceNum) {
			square = gameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];			
			if(gameBoard.pieces[square + 10] == PIECES.EMPTY) {
				AddWhitePawnQuietMove(square, square+10);
				if(ranksBoard[square] == RANKS.RANK_2 && gameBoard.pieces[square + 20] == PIECES.EMPTY) {
					AddQuietMove( MOVE(square, square + 20, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant ));
				}
			}
			if(squareOffBoard(square + 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[square+9]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(square, square + 9, gameBoard.pieces[square+9]);
			}
			
			if(squareOffBoard(square + 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[square+11]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(square, square + 11, gameBoard.pieces[square+11]);
			}			
			
			if(gameBoard.enPas != SQUARES.NOSQ) {
				if(square + 9 == gameBoard.enPas) {
					AddEnPassantMove( MOVE(square, square+9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
				
				if(square + 11 == gameBoard.enPas) {
					AddEnPassantMove( MOVE(square, square+11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
			}			
			
		}
		
		if(gameBoard.castlePerm & CASTLEBIT.WKCA) {			
			if(gameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ));
				}
			}
		}
		
		if(gameBoard.castlePerm & CASTLEBIT.WQCA) {
			if(gameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ));
				}
			}
		}		

	} else {
		pieceType = PIECES.bP;
		
		for(pieceNum = 0; pieceNum < gameBoard.pieceNumber[pieceType]; ++pieceNum) {
			square = gameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];
			if(gameBoard.pieces[square - 10] == PIECES.EMPTY) {
				AddBlackPawnQuietMove(square, square-10);		
				if(ranksBoard[square] == RANKS.RANK_7 && gameBoard.pieces[square - 20] == PIECES.EMPTY) {
					AddQuietMove( MOVE(square, square - 20, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant ));
				}
			}
			
			if(squareOffBoard(square - 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[square-9]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(square, square - 9, gameBoard.pieces[square-9]);
			}
			
			if(squareOffBoard(square - 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[square-11]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(square, square - 11, gameBoard.pieces[square-11]);
			}			
			
			if(gameBoard.enPas != SQUARES.NOSQ) {
				if(square - 9 == gameBoard.enPas) {
					AddEnPassantMove( MOVE(square, square-9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
				
				if(square - 11 == gameBoard.enPas) {
					AddEnPassantMove( MOVE(square, square-11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP ) );
				}
			}
		}
		if(gameBoard.castlePerm & CASTLEBIT.BKCA) {	
			if(gameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.F8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ));
				}
			}
		}
		
		if(gameBoard.castlePerm & CASTLEBIT.BQCA) {
			if(gameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.D8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MFLAGCA ));
				}
			}
		}	
	}	
	
	pieceIndex = loopNonSlideIndex[gameBoard.side];
	piece = loopNonSlidePiece[pieceIndex++];
	
	while (piece != 0) {
		for(pieceNum = 0; pieceNum < gameBoard.pieceNumber[piece]; ++pieceNum) {
			square = gameBoard.pieceList[PIECEINDEX(piece, pieceNum)];
			
			for(index = 0; index < dirNum[piece]; index++) {
				direction = pieceDir[piece][index];
				targetSquare = square + direction;
				
				if(squareOffBoard(targetSquare) == BOOL.TRUE) {
					continue;
				}
				
				if(gameBoard.pieces[targetSquare] != PIECES.EMPTY) {
					if(PieceCol[gameBoard.pieces[targetSquare]] != gameBoard.side) {
						AddCaptureMove( MOVE(square, targetSquare, gameBoard.pieces[targetSquare], PIECES.EMPTY, 0 ));
					}
				} else {
					AddQuietMove( MOVE(square, targetSquare, PIECES.EMPTY, PIECES.EMPTY, 0 ));
				}
			}			
		}	
		piece = loopNonSlidePiece[pieceIndex++];
	}
	
	pieceIndex = loopSlideIndex[gameBoard.side];
	piece = loopSlidePiece[pieceIndex++];
	
	while(piece != 0) {		
		for(pieceNum = 0; pieceNum < gameBoard.pieceNumber[piece]; ++pieceNum) {
			square = gameBoard.pieceList[PIECEINDEX(piece, pieceNum)];
			
			for(index = 0; index < dirNum[piece]; index++) {
				direction = pieceDir[piece][index];
				targetSquare = square + direction;
				
				while( squareOffBoard(targetSquare) == BOOL.FALSE ) {	
				
					if(gameBoard.pieces[targetSquare] != PIECES.EMPTY) {
						if(PieceCol[gameBoard.pieces[targetSquare]] != gameBoard.side) {
							AddCaptureMove( MOVE(square, targetSquare, gameBoard.pieces[targetSquare], PIECES.EMPTY, 0 ));
						}
						break;
					}
					AddQuietMove( MOVE(square, targetSquare, PIECES.EMPTY, PIECES.EMPTY, 0 ));
					targetSquare += direction;
				}
			}			
		}	
		piece = loopSlidePiece[pieceIndex++];
	}
}
