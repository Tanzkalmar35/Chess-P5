
function move(from, to, captured, promoted, flag) {
    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
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

        for (pieceNum = 0; pieceNum < gameBoard.pieceNumber[pieceType]; pieceType++) {
            square = gameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];

            if (gameBoard.pieces[square + 10] == PIECES.EMPTY) {
                // Add Pawn move
                if (ranksBoard[square] == RANKS.RANK_2 && gameBoard.pieces[square + 20] == PIECES.EMPTY) {
                    // Add quiet move
                }
            }
            if (squareOffBoard(square + 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[square + 9]] == COLOURS.BLACK) {
                //Add Pawn capture move
            }
            if (squareOffBoard(square + 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[square + 11]] == COLOURS.BLACK) {
                //Add Pawn capture move
            }
            if (gameBoard.enPassant != SQUARES.NO_SQ) {
                if (square + 9 == gameBoard.enPassant) {
                    //Add enPassant move
                }
                if (square + 11 == gameBoard.enPassant) {
                    //Add enPassant move
                }
            }

        }
        /**************************************************************** checking if white can castle *************************/
        if (gameBoard.castlePerm & CASTLEBIT.WKCA) {
            if (gameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
                if (squareAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                    //Add a quiet move
                }
            }
        }
        if (gameBoard.castlePerm & CASTLEBIT.WQCA) {
            if (gameBoard.pieces[SQUARES.D1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.C1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
                if (squareAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                    //Add a quiet move
                }
            }
        }

        pieceType = PIECES.wN;
    } else {
        /**************************************************************** moves for black Pawns *************************/
        pieceType = PIECES.bP;

        for (pieceNum = 0; pieceNum < gameBoard.pieceNumber[pieceType]; pieceType++) {
            square = gameBoard.pieceList[PIECEINDEX(pieceType, pieceNum)];

            if (gameBoard.pieces[sq - 10] == PIECES.EMPTY) {
                // Add Pawn move
                if (ranksBoard[square] == RANKS.RANK_7 && gameBoard.pieces[square - 20] == PIECES.EMPTY) {
                    // Add quiet move
                }
            }
            if (SQUARES.OFFBOARD(square - 9) == BOOL.FALSE && pieceCol[gameBoard.pieces[square - 9]] == COLOURS.WHITE) {
                //Add Pawn capture move
            }
            if (SQUARES.OFFBOARD(square - 11) == BOOL.FALSE && pieceCol[gameBoard.pieces[square - 11]] == COLOURS.WHITE) {
                //Add Pawn capture move
            }
            if (gameBoard.enPassant != SQUARES.NO_SQ) {
                if (square - 9 == gameBoard.enPassant) {
                    //Add enPassant move
                }
                if (square - 11 == gameBoard.enPassant) {
                    //Add enPassant move
                }
            }
        }
        /**************************************************************** checking if black can castle *************************/
        if (gameBoard.castlePerm & CASTLEBIT.BKCA) {
            if (gameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
                if (squareAttacked(SQUARES.F8, COLOURS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E8, COLOURS.BLACK) == BOOL.FALSE) {
                    //Add a quiet move
                }
            }
        }
        if (gameBoard.castlePerm & CASTLEBIT.BQCA) {
            if (gameBoard.pieces[SQUARES.D8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.C8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
                if (squareAttacked(SQUARES.D8, COLOURS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E8, COLOURS.BLACK) == BOOL.FALSE) {
                    //Add a quiet move
                }
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
                        //add a capture
                    }
                } else {
                    //quiet move
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
                            //add a capture
                        }
                        break;
                    }
                    //Add Quiet move
                    targetSquare += direction;
                }
            }
        }
        piece = loopSlidePiece[pieceIndex++];
    }

}
