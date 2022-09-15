
function MOVE(from, to, captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function addCaptureMove(move) {
	gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply+1]] = move;
	gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply+1]++] = 0;
}

function addQuietMove(move) {
	gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply+1]] = move;
	gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply+1]++] = 0;
}

function addEnPassantMove(move) {
	gameBoard.moveList[gameBoard.moveListStart[gameBoard.ply+1]] = move;
	gameBoard.moveScores[gameBoard.moveListStart[gameBoard.ply+1]++] = 0;
}

/**************************************************************** functions to generate moves for the pawns *************************/

function addWhitePawnCaptureMove(fromSquare, toSquare, capture) {
    if (ranksBoard[fromSquare] == RANKS.RANK_7) {
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.wQ, 0));
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.wR, 0));
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.wB, 0));
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.wN, 0));
    } else {
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.EMPTY, 0));
    }
}

function addBlackPawnCaptureMove(fromSquare, toSquare, capture) {
    if (ranksBoard[fromSquare] == RANKS.RANK_2) {
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.bQ, 0));
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.bR, 0));
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.bB, 0));
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.bN, 0));
    } else {
        addCaptureMove(MOVE(fromSquare, toSquare, capture, PIECES.EMPTY, 0));
    }
}

function addWhiteQuietMove(fromSquare, toSquare) {
    if (ranksBoard[fromSquare] == RANKS.RANK_7) {
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.wQ, 0));
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.wR, 0));
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.wB, 0));
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.wN, 0));
    } else {
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.EMPTY, 0));
    }
}

function addBlackQuietMove(fromSquare, toSquare) {
    if (ranksBoard[fromSquare] == RANKS.RANK_2) {
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.bQ, 0));
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.bR, 0));
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.bB, 0));
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.bN, 0));
    } else {
        addQuietMove(MOVE(fromSquare, toSquare, PIECES.EMPTY, PIECES.EMPTY, 0));
    }
}

/**************************************************************** functions to generate the moves *************************/
function generateMoves() {
    gameBoard.moveListStart[gameBoard.ply + 1] = gameBoard.moveListStart[gameBoard.ply];

    var pieceType;
    var pieceNum;
    var square;
    var pieceIndex;
    var piece;
    var targetSquare;
    var direction;

    if (gameBoard.side == COLOURS.WHITE) {
        /**************************************************************** moves for white Pawns *************************/
        pieceType = PIECES.wP;

        for (pieceNum = 0; pieceNum < gameBoard.pieceNumber[pieceType]; pieceNum++) {
            square = gameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];

            if (gameBoard.pieces[square + 10] == PIECES.EMPTY) {
                addWhiteQuietMove(square, square + 10);
                if (ranksBoard[square] == RANKS.RANK_2 && gameBoard.pieces[square + 20] == PIECES.EMPTY) {
                    addQuietMove( MOVE(square, square + 20, PIECES.EMPTY, PIECES.EMPTY, moveFlagPawnStart) );                }
            }
            if (squareOffBoard(square + 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[square + 9]] == COLOURS.BLACK) {
                addWhitePawnCaptureMove(square, square + 9, gameBoard.pieces[square + 9]);
            }
            if (squareOffBoard(square + 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[square + 11]] == COLOURS.BLACK) {
                addWhitePawnCaptureMove(square, square + 9, gameBoard.pieces[square + 11]);            }
            if (gameBoard.enPassant != SQUARES.NO_SQ) {
                if (square + 9 == gameBoard.enPassant) {
                    addEnPassantMove( MOVE(square, square + 9, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant) );
                }
                if (square + 11 == gameBoard.enPassant) {
                    addEnPassantMove( MOVE(square, square + 11, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant) );
                }
            }

        }
        /**************************************************************** checking if white can castle *************************/
        if (gameBoard.castlePerm & CASTLEBIT.WKCA) {
            if (gameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
                if (squareAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                    addQuietMove( MOVE(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle) );                }
            }
        }
        if (gameBoard.castlePerm & CASTLEBIT.WQCA) {
            if (gameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
                if (squareAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                    addQuietMove( MOVE(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle) );                }
            }
        }

        pieceType = PIECES.wN;
    } else {
        /**************************************************************** moves for black Pawns *************************/
        pieceType = PIECES.bP;

        for (pieceNum = 0; pieceNum < gameBoard.pieceNumber[pieceType]; pieceNum++) {
            square = gameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];

            if (gameBoard.pieces[square - 10] == PIECES.EMPTY) {
                addBlackQuietMove(square, square - 10);
                if (ranksBoard[square] == RANKS.RANK_7 && gameBoard.pieces[square - 20] == PIECES.EMPTY) {
                    addQuietMove( MOVE(square, square - 20, PIECES.EMPTY, PIECES.EMPTY, moveFlagPawnStart) );
                }
            }
            if (SQUARES.OFFBOARD(square - 9) == BOOL.FALSE && pieceCol[gameBoard.pieces[square - 9]] == COLOURS.WHITE) {
                addBlackPawnCaptureMove(square, square - 9, gameBoard.pieces[square - 9]);            }
            if (SQUARES.OFFBOARD(square - 11) == BOOL.FALSE && pieceCol[gameBoard.pieces[square - 11]] == COLOURS.WHITE) {
                addBlackPawnCaptureMove(square, square - 11, gameBoard.pieces[square + 9]);            }
            if (gameBoard.enPassant != SQUARES.NO_SQ) {
                if (square - 9 == gameBoard.enPassant) {
                    addEnPassantMove( MOVE(square, square - 9, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant) );
                }
                if (square - 11 == gameBoard.enPassant) {
                    addEnPassantMove( MOVE(square, square - 11, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPassant) );
                }
            }
        }
        /**************************************************************** checking if black can castle *************************/
        if (gameBoard.castlePerm & CASTLEBIT.BKCA) {
            if (gameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
                if (squareAttacked(SQUARES.F8, COLOURS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E8, COLOURS.BLACK) == BOOL.FALSE) {
                    addQuietMove( MOVE(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle) );
                }
            }
        }
        if (gameBoard.castlePerm & CASTLEBIT.BQCA) {
            if (gameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
                if (squareAttacked(SQUARES.D8, COLOURS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E8, COLOURS.BLACK) == BOOL.FALSE) {
                    addQuietMove( MOVE(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle) );                }
            }
        }

        pieceType = PIECES.bN;
    }
    /**************************************************************** generating moves for non-sliding pieces *************************/
    pieceIndex = loopNonSlideIndex[gameBoard.side];
    piece = loopNonSlidePiece[pieceIndex++];

    while (piece != 0) {
        for (pieceNum = 0; pieceNum < gameBoard.pieceNumber[piece]; pieceNum++) {
            square = gameBoard.pieceList[PIECEINDEX(piece, pieceNum)];

            for (var i = 0; i < dirNum[piece]; i++) {
                direction = pieceDir[piece][i];
                targetSquare = square + direction;

                if (squareOffBoard(targetSquare) == BOOL.TRUE) {
                    continue;
                }
                if (gameBoard.pieces[targetSquare] != PIECES.EMPTY) {
                    if (PieceCol[gameBoard.pieces[targetSquare]] != gameBoard.side) {
                        addCaptureMove( MOVE(piece, targetSquare, gameBoard.pieces[targetSquare], PIECES.EMPTY, 0));
                    }
                } else {
                    addQuietMove( MOVE(piece, targetSquare, PIECES.EMPTY, PIECES.EMPTY, 0));
                }
            }
        }
        piece = loopNonSlidePiece[pieceIndex++];
    }

    /**************************************************************** generating moves for sliding pieces *************************/
    pieceIndex = loopSlideIndex[gameBoard.side];
    piece = loopSlidePiece[pieceIndex++];

    while (piece != 0) {
        for (pieceNum = 0; pieceNum < gameBoard.pieceNumber[piece]; pieceNum++) {
            square = gameBoard.pieceList[PIECEINDEX(piece, pieceNum)];

            for (var i = 0; i < dirNum[piece]; i++) {
                direction = pieceDir[piece][i];
                targetSquare = square + direction;

                while (squareOffBoard(targetSquare) == BOOL.FALSE) {
                    if (gameBoard.pieces[targetSquare] != PIECES.EMPTY) {
                        if (PieceCol[gameBoard.pieces[targetSquare]] != gameBoard.side) {
                            addCaptureMove( MOVE(piece, targetSquare, gameBoard.pieces[targetSquare], PIECES.EMPTY, 0));
                        }
                        break;
                    }
                    addQuietMove( MOVE(piece, targetSquare, PIECES.EMPTY, PIECES.EMPTY, 0));
                    targetSquare += direction;
                }
            }
        }
        piece = loopSlidePiece[pieceIndex++];
    }

}
