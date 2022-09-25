function getPvLine(depth) {
	
	var move = probePvTable();
	var count = 0;
	
	while(move != noMove && count < depth) {
		if( moveExists(move) == BOOL.TRUE) {
			makeMove(move);
			gameBoard.pvArray[count++] = move;		
		} else {
			break;
		}		
		move = probePvTable();	
	}
	
	while(gameBoard.ply > 0) {
		takeMove();
	}
	return count;
	
}

function probePvTable() {
	var index = gameBoard.positionKey % PVENTRIES;
	
	if(gameBoard.pvTable[index].posKey == gameBoard.positionKey) {
		return gameBoard.pvTable[index].move;
	}
	
	return noMove;
}

function storePvMove(move) {
	var index = gameBoard.positionKey % PVENTRIES;
	gameBoard.pvTable[index].posKey = gameBoard.positionKey;
	gameBoard.pvTable[index].move = move;
}
