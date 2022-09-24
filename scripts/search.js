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
	
	for(index = 0; index < PVENTRIES; index++) {
			gameBoard.pvTable[index].move = noMove;
			gameBoard.pvTable[index].posKey = 0;		
	}
}

function checkUp() {
	if (( $.now() - searchController.start ) > searchController.time) {
		searchController.stop == BOOL.TRUE;
	}
}

function isRepetition() {
	var index = 0;
	
	for(index = gameBoard.hisPly - gameBoard.fiftyMove; index < gameBoard.hisPly - 1; ++index) {
		if(gameBoard.positionKey == gameBoard.history[index].posKey) {
			return BOOL.TRUE;
		}
	}
	
	return BOOL.FALSE;
}

function alphaBeta(alpha, beta, depth) {

	searchController.nodes++;
	if(depth <= 0) {
		return evalPosition();
	}
	
	if ((searchController.nodes & 2047) == 0) {
		checkUp();
	}
	
	
	
	if( (isRepetition() || gameBoard.fiftyMove >= 100) && gameBoard.ply != 0) {
		return 0;
	}
	
	if(gameBoard.ply > MAXDEPTH -1) {
		return evalPosition();
	}	

	
	var InCheck = SquareAttacked(gameBoard.pieceList[PIECEINDEX(Kings[gameBoard.side],0)], gameBoard.side^1);
	if(InCheck == BOOL.TRUE)  {
		depth++;
	}	
	
	var Score = -INFINITE;
	
	generateMoves();
	
	var MoveNum = 0;
	var Legal = 0;
	var OldAlpha = alpha;
	var BestMove = noMove;
	var Move = noMove;
	
	/* Get PvMove */
	/* Order PvMove */	
	
	for(MoveNum = gameBoard.moveListStart[gameBoard.ply]; MoveNum < gameBoard.moveListStart[gameBoard.ply + 1]; ++MoveNum) {
	
		/* Pick Next Best Move */
		
		Move = gameBoard.moveList[MoveNum];	

		if(makeMove(Move) == BOOL.FALSE) {
			continue;
		}		
		Legal++;
		Score = -alphaBeta( -beta, -alpha, depth-1);
		
		takeMove();
		
		if(searchController.stop == BOOL.TRUE) {
			return 0;
		}
		
		if(Score > alpha) {
			if(Score >= beta) {
				if(Legal == 1) {
					searchController.fhf++;
				}
				searchController.fh++;				
				/* Update Killer Moves */
				
				return beta;
			}
			alpha = Score;
			BestMove = Move;
			/* Update History Table */
		}		
	}	
	
	if(Legal == 0) {
		if(InCheck == BOOL.TRUE) {
			return -MATE + gameBoard.ply;
		} else {
			return 0;
		}
	}	
	
	if(alpha != OldAlpha) {
		storePvMove(BestMove);
	}
	
	return alpha;
}

function clearForSearch() {

	var index = 0;
	var index2 = 0;
	
	for(index = 0; index < 14 * boardSquareNumber; ++index) {		
		gameBoard.searchHistory[index] = 0;	
	}
	
	for(index = 0; index < 3 * MAXDEPTH; ++index) {
		gameBoard.searchKillers[index] = 0;
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
	var currentDepth = 0;
	var line;
	var PvNum;
	var c;

	clearForSearch();
	
	for( currentDepth = 1; currentDepth <= /*SearchController.depth*/ 5; ++currentDepth) {	
	
		bestScore = alphaBeta(-INFINITE, INFINITE, currentDepth);
					
		if(searchController.stop == BOOL.TRUE) {
			break;
		}
		
		bestMove = probePvTable();

		console.log(bestMove);
		line = 'D:' + currentDepth + ' Best:' + printMove(bestMove) + ' Score:' + bestScore + 
				' nodes:' + searchController.nodes;
				
		PvNum = getPvLine(currentDepth);
		line += ' Pv:';
		for( c = 0; c < PvNum; ++c) {
			line += ' ' + printMove(gameBoard.pvArray[c]);
		}
		console.log(line);
						
	}
	
	searchController.best = bestMove;
	searchController.thinking = BOOL.FALSE;

}











































