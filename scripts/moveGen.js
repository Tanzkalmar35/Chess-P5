
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
	
	var pceType;
	var pceNum;
	var sq;
	var pceIndex;
	var pce;
	var t_sq;
	var dir;
	
	if(gameBoard.side == COLOURS.WHITE) {
		pceType = PIECES.wP;
		
		for(pceNum = 0; pceNum < gameBoard.pieceNumber[pceType]; ++pceNum) {
			sq = gameBoard.pieceList[PIECEINDEX(pceType, pceNum)];			
			if(gameBoard.pieces[sq + 10] == PIECES.EMPTY) {
				AddWhitePawnQuietMove(sq, sq+10);
				if(ranksBoard[sq] == RANKS.RANK_2 && gameBoard.pieces[sq + 20] == PIECES.EMPTY) {
					AddQuietMove( MOVE(sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, moveFlagPawnStart ));
				}
			}
			
			if(squareOffBoard(sq + 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[sq+9]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 9, gameBoard.pieces[sq+9]);
			}
			
			if(squareOffBoard(sq + 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[sq+11]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq + 11, gameBoard.pieces[sq+11]);
			}			
			
			if(gameBoard.enPassant != SQUARES.NOSQ) {
				if(sq + 9 == gameBoard.enPassant) {
					AddEnPassantMove( MOVE(sq, sq+9, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant ) );
				}
				
				if(sq + 11 == gameBoard.enPassant) {
					AddEnPassantMove( MOVE(sq, sq+11, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant ) );
				}
			}			
			
		}
		
		if(gameBoard.castlePerm & CASTLEBIT.WKCA) {			
			if(gameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle ));
				}
			}
		}
		
		if(gameBoard.castlePerm & CASTLEBIT.WQCA) {
			if(gameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle ));
				}
			}
		}		

	} else {
		pceType = PIECES.bP;
		
		for(pceNum = 0; pceNum < gameBoard.pieceNumber[pceType]; ++pceNum) {
			sq = gameBoard.pieceList[PIECEINDEX(pceType, pceNum)];
			if(gameBoard.pieces[sq - 10] == PIECES.EMPTY) {
				AddBlackPawnQuietMove(sq, sq-10);		
				if(ranksBoard[sq] == RANKS.RANK_7 && gameBoard.pieces[sq - 20] == PIECES.EMPTY) {
					AddQuietMove( MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, moveFlagPawnStart ));
				}
			}
			
			if(squareOffBoard(sq - 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[sq-9]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 9, gameBoard.pieces[sq-9]);
			}
			
			if(squareOffBoard(sq - 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[sq-11]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq - 11, gameBoard.pieces[sq-11]);
			}			
			
			if(gameBoard.enPassant != SQUARES.NOSQ) {
				if(sq - 9 == gameBoard.enPassant) {
					AddEnPassantMove( MOVE(sq, sq-9, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant ) );
				}
				
				if(sq - 11 == gameBoard.enPassant) {
					AddEnPassantMove( MOVE(sq, sq-11, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant ) );
				}
			}
		}
		if(gameBoard.castlePerm & CASTLEBIT.BKCA) {	
			if(gameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.F8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle ));
				}
			}
		}
		
		if(gameBoard.castlePerm & CASTLEBIT.BQCA) {
			if(gameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
				if(SqAttacked(SQUARES.D8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
					AddQuietMove( MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle ));
				}
			}
		}	
	}	
	
	pceIndex = loopNonSlideIndex[gameBoard.side];
	pce = loopNonSlidePiece[pceIndex++];
	
	while (pce != 0) {
		for(pceNum = 0; pceNum < gameBoard.pieceNumber[pce]; ++pceNum) {
			sq = gameBoard.pieceList[PIECEINDEX(pce, pceNum)];
			
			for(index = 0; index < dirNum[pce]; index++) {
				dir = pieceDir[pce][index];
				t_sq = sq + dir;
				
				if(squareOffBoard(t_sq) == BOOL.TRUE) {
					continue;
				}
				
				if(gameBoard.pieces[t_sq] != PIECES.EMPTY) {
					if(PieceCol[gameBoard.pieces[t_sq]] != gameBoard.side) {
						AddCaptureMove( MOVE(sq, t_sq, gameBoard.pieces[t_sq], PIECES.EMPTY, 0 ));
					}
				} else {
					AddQuietMove( MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));
				}
			}			
		}	
		pce = loopNonSlidePiece[pceIndex++];
	}
	
	pceIndex = loopSlideIndex[gameBoard.side];
	pce = loopSlidePiece[pceIndex++];
	
	while(pce != 0) {		
		for(pceNum = 0; pceNum < gameBoard.pieceNumber[pce]; ++pceNum) {
			sq = gameBoard.pieceList[PIECEINDEX(pce, pceNum)];
			
			for(index = 0; index < dirNum[pce]; index++) {
				dir = pieceDir[pce][index];
				t_sq = sq + dir;
				
				while( squareOffBoard(t_sq) == BOOL.FALSE ) {	
				
					if(gameBoard.pieces[t_sq] != PIECES.EMPTY) {
						if(PieceCol[gameBoard.pieces[t_sq]] != gameBoard.side) {
							AddCaptureMove( MOVE(sq, t_sq, gameBoard.pieces[t_sq], PIECES.EMPTY, 0 ));
						}
						break;
					}
					AddQuietMove( MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0 ));
					t_sq += dir;
				}
			}			
		}	
		pce = loopSlidePiece[pceIndex++];
	}
}

