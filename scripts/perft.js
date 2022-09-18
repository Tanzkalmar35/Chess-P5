var perft_leafNodes;

function perft(depth) {

    if (depth == 0) {
        perft_leafNodes++;
        return;
    }

    generateMoves();

    var move;

    for (var i = gameBoard.moveListStart[gameBoard.ply]; i < gameBoard.moveListStart[gameBoard.ply + 1]; i++) {
        move = gameBoard.moveList[i];
        if (makeMove(move) == BOOL.FALSE) {
            continue;
        }
        perft(depth - 1);
        takeMove();
    }
    return;
}

function perftTest(depth) {

    printBoardToConsole();
	console.log("Starting Test To Depth:" + depth);	
	perft_leafNodes = 0;

	var index;
	var move;
	var moveNum = 0;
	generateMoves();
	for(index = gameBoard.moveListStart[gameBoard.ply]; index < gameBoard.moveListStart[gameBoard.ply + 1]; ++index) {
	
		move = gameBoard.moveList[index];	
		if(makeMove(move) == BOOL.FALSE) {
			continue;
		}	
		moveNum++;	
        var cumnodes = perft_leafNodes;
		perft(depth-1);
		takeMove();
		var oldnodes = perft_leafNodes - cumnodes;
        console.log("move " + moveNum + ": " + PrMove(move) + " " + oldnodes);
	}
    
	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");      

    return;

}
 