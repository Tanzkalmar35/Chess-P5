
function getPvLine(depth) {
    var move = probePvTable();
    var count = 0;
    var times = 1;

    while(move != noMove && count < depth) {
        console.log("count: " + count + ", depth: " + depth);
        if (moveExists(move) == BOOL.TRUE) {
            makeMove(move);
            gameBoard.pvArray[count++] = move;
        } else {
            console.log("LOOP BROKEN!");
            break;
        }
        move = probePvTable();
        console.log(times);
		times++;
    }

    while (gameBoard.ply > 0) {
        takeMove();
    }
    return count;

}

function probePvTable() {
    var i = gameBoard.positionKey % PVENTRIES;

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
