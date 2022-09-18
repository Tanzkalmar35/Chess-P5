var searchController = {};

searchController.nodes;
searchController.fh;
searchController.fhf;
searchController.depth;
searchController.time;
searchController.start;
searchController.stop;
searchController.best;
searchController.thinking;

function clearPvTable() {
    for (var i = 0; i < PVENTRIES; i++) {
        gameBoard.pvTable[i].move = noMove;
        gameBoard.pvTable[i].positionKey = 0;
    }
}

function checkTime() {
    if (($.now() - searchController.start) > searchController.time) {
        searchController.stop() = BOOL.TRUE;
    }
}

function isRepitition() {
    for (var i = gameBoard.hisPly - gameBoard.fiftyMove; i < gameBoard.hisPly - 1; i++) {
        if (gameBoard.positionKey == gameBoard.history[i].positionKey) {
            return BOOL.TRUE;
        }
    }
    return BOOL.FALSE;
}

function alphaBeta(alpha, beta, depth) {

    searchController.nodes++;

    if (depth <= 0) {
        return evaluatePosition();
    }

    //Checking for the thinking time
    if ((searchController.nodes & 2047) == 0) {
        checkTime();
    }

    //checking for repititions and fiftyMove rule
    if ((isRepitition() || gameBoard.fiftyMove >= 100) && gameBoard.ply != 0) {
        return 0;
    }

    if (gameBoard.ply < MAXDEPTH - 1) {
        return evaluatePosition();
    }

    var inCheck = squareAttacked(gameBoard.pieceList[PIECEINDEX(kings[gameBoard.side], 0)], gameBoard.side^1);
    if (inCheck == BOOL.TRUE) {
        depth++;
    }

    var score = -INFINITE;

    generateMoves();

    var moveNumber = 0;
    var legal = 0;
    var oldAlpha = alpha;
    var bestMove = noMove;
    var move = noMove;

    // get pvMove
    //Order pvMove

    for (moveNumber = gameBoard.moveListStart[gameBoard.ply]; moveNumber < gameBoard.moveListStart[gameBoard.ply + 1]; moveNumber++) {
        move = gameBoard.moveList[moveNumber];
        if (makeMove(move) == BOOL.FALSE) {
            continue;
        }
        legal++;
        score = -alphaBeta(-beta, -alpha, depth-1);

        takeMove();

        if (searchController.stop == BOOL.TRUE) {
            return 0;
        }

        if (score > alpha) {
            if (score >= beta) {
                if (legal == 1) {
                    searchController.fhf++;
                }
                searchController.fh++;
                //update killer moves
                return beta;
            }
            alpha = score;
            bestMove = move;
            //update history table
        }
    }

    if (legal == 0) {
        if (inCheck == BOOL.TRUE) {
            return -MATE + gameBoard.ply;
        } else {
            return 0;
        }
    }

    if (alpha != oldAlpha) {
        storePvMove(bestMove);
        console.log("bestMove: " + bestMove);
    } else {
        console.log("alpha is equal to old alpha");
    }

    return alpha;
}

function clearForSearch() {
    for (var i = 0; i < 14 * boardSquareNumber; i++) {
        gameBoard.searchHistory[i] = 0;
    }
    for (var k = 0; k < 3 * MAXDEPTH; k++) {
        gameBoard.searchKillers[k] = 0;
    }

    clearPvTable();

    gameBoard.ply = 0;
    searchController.nodes = 0;
    searchController.fh = 0;
    searchController.fhf = 0;
    searchController.start = $.now();
    searchController.stop = BOOL.FALSE;
}

function searchPosition() {

    var bestMove = noMove;
    var bestScore = -INFINITE;
    var currentdepth = 0;
    var line;

    clearForSearch();

    for (currentdepth = 1; currentdepth <= /*searchController.depth*/5; currentdepth++) {

        //Alpha-beta search algorithm
        bestScore = alphaBeta(-INFINITE, INFINITE, currentdepth);

        if (searchController.stop == BOOL.TRUE) {
            break;
        }

        bestMove = probePvTable();
        line = "D: " + currentdepth + " Best: " + PrMove(bestMove) + " Score: " + bestScore + " Nodes: " + searchController.nodes;
        console.log(line);
    }

    searchController.best = bestMove;
    searchController.thinking = BOOL.FALSE;

}