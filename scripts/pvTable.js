function probePvTable() {
    var i = gameBoard.positionKey % PVENTRIES;

    //ERROR: gameBoard.pvTable[i].positionKey = 0

    if (gameBoard.pvTable[i].positionKey == gameBoard.positionKey) {
        return gameBoard.pvTable[i].move;
    }
    return noMove;
}

function storePvMove(move) {
    var i = gameBoard.positionKey % PVENTRIES;
    gameBoard.pvTable[i].positionKey = gameBoard.positionKey;
    gameBoard.pvTable[i].move = move;
}
