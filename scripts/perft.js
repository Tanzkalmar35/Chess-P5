var perft_leafNodes;

function perft(depth) { 	

	if(depth == 0) {
        perft_leafNodes++;
        return;
    }	
    
    generateMoves();
    
	var move;
	
	for(var i = gameBoard.moveListStart[gameBoard.ply]; i < gameBoard.moveListStart[gameBoard.ply + 1]; ++i) {
	
		move = gameBoard.moveList[i];	
		if(makeMove(move) == BOOL.FALSE) {
			continue;
		}		
		perft(depth-1);
		takeMove();
	}
    
    return;
}

function perftTest(depth) {    

	printBoard();
	console.log("Starting Test To Depth:" + depth);	
	perft_leafNodes = 0;

	var move;
	var moveNum = 0;
	for(var i = gameBoard.moveListStart[gameBoard.ply]; i < gameBoard.moveListStart[gameBoard.ply + 1]; ++i) {
	
		move = gameBoard.moveList[i];	
		if(makeMove(move) == BOOL.FALSE) {
			continue;
		}	
		moveNum++;	
        var cumnodes = perft_leafNodes;
		perft(depth-1);
		takeMove();
		var oldnodes = perft_leafNodes - cumnodes;
        console.log("move:" + moveNum + " " + printMove(move) + " " + oldnodes);
	}
    
	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");      

    return;

}



















































