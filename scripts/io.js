function printSquare(square) {
    return (fileChar[filesBoard[square]] + rankChar[ranksBoard[square]]);
}
function printMove(move) {
    var moveString;
    
    var fromFile = filesBoard[fromSquare(move)];
    var rankFrom = ranksBoard[fromSquare(move)];
    var fileTo = filesBoard[toSquare(move)];
    var rankTo = ranksBoard[toSquare(move)];

    moveString = fileChar[fromFile] + rankChar[rankFrom] + fileChar[fileTo] + rankChar[rankTo];

    var Promoted = promoted(move);

    //console.log(Promoted);

    if (Promoted != PIECES.EMPTY) {
        var pieceChar = "q";
        if (PieceKnight[Promoted] == BOOL.TRUE) {
            pieceChar = "n";
        } else if (PieceRookQueen[Promoted] == BOOL.TRUE && PieceBishopQueen[Promoted] == BOOL.FALSE) {
            pieceChar = "r";
        } else if (PieceRookQueen[Promoted] == BOOL.FALSE && PieceBishopQueen[Promoted] == BOOL.TRUE) {
            pieceChar = "b";
        }
        moveString += pieceChar;
    } else {
        //console.log("Promoted is undefined");
    }
    return moveString;
}

function printMoveList() {
    var move;
    console.log("MoveList: ");

    for (var i = gameBoard.moveListStart[gameBoard.ply]; i < gameBoard.moveListStart[gameBoard.ply + 1]; ++i) {
        move = gameBoard.moveList[i];
        //console.log(move);
        console.log(printMove(move) + " - " + move);
        move = gameBoard.moveList[i];
    }
}