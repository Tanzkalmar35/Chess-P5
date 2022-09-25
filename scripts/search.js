// EXPLANATION: Killer moves are moves that have a better score than beta.

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

function pickNextMove(moveNumber) {
	var bestScore = -1;
	var bestNumber = moveNumber;

	for (var i = moveNumber; i < gameBoard.moveListStart[gameBoard.ply + 1]; i++) {
		if (gameBoard.moveScores[i] > bestScore) {
			bestScore = gameBoard.moveScores[i];
			bestNumber = i;
		}
	}

	if (bestNumber != moveNumber) {
		var temp = 0;
		temp = gameBoard.moveScores[moveNumber];
		gameBoard.moveScores[moveNumber] = gameBoard.moveScores[bestNumber];
		gameBoard.moveScores[bestNumber] = temp;

		temp = gameBoard.moveList[moveNumber];
		gameBoard.moveList[moveNumber] = gameBoard.moveList[bestNumber];
		gameBoard.moveList[bestNumber] = temp;
	}

}

function clearPvTable() {
	
	for(index = 0; index < PVENTRIES; index++) {
			gameBoard.pvTable[index].move = noMove;
			gameBoard.pvTable[index].posKey = 0;		
	}
}

function checkUp() {
	if (( $.now() - searchController.start ) > searchController.time) {
		searchController.stop = BOOL.TRUE;
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

function quieScence(alpha, beta) {

	if ((searchController.nodes & 2047) == 0) {
		checkUp();
	}

	searchController.nodes++;
	
	if( (isRepetition() || gameBoard.fiftyMove >= 100) && gameBoard.ply != 0) {
		return 0;
	}
	
	if(gameBoard.ply > MAXDEPTH -1) {
		return evalPosition();
	}

	var score = evalPosition();

	if (score >= beta) {
		return beta;
	} 

	if (score > alpha) {
		alpha = score;
	}

	generateCaptures();
	
	var MoveNum = 0;
	var Legal = 0;
	var OldAlpha = alpha;
	var BestMove = noMove;
	var Move = noMove;
	
	var pvMove = probePvTable();
	if (pvMove != noMove) {
		for(MoveNum = gameBoard.moveListStart[gameBoard.ply]; MoveNum < gameBoard.moveListStart[gameBoard.ply + 1]; ++MoveNum) {
			if (gameBoard.moveList[MoveNum] == pvMove) {
				gameBoard.moveScores[MoveNum] = 2000000;
				break;
			}
		}
	
	}		
	
	for(MoveNum = gameBoard.moveListStart[gameBoard.ply]; MoveNum < gameBoard.moveListStart[gameBoard.ply + 1]; ++MoveNum) {
	
		pickNextMove(MoveNum);
		
		Move = gameBoard.moveList[MoveNum];	

		if(makeMove(Move) == BOOL.FALSE) {
			continue;
		}		
		Legal++;
		score = -quieScence( -beta, -alpha);
		
		takeMove();
		
		if(searchController.stop == BOOL.TRUE) {
			return 0;
		}
		
		if(score > alpha) {
			if(score >= beta) {
				if(Legal == 1) {
					searchController.fhf++;
				}
				searchController.fh++;				
				return beta;
			}
			alpha = score;
			BestMove = Move;
		}		
	}

	if(alpha != OldAlpha) {
		storePvMove(BestMove);
	}

	return alpha;

}

function alphaBeta(alpha, beta, depth) {

	if(depth <= 0) {
		return quieScence(alpha, beta);
	}
	
	if ((searchController.nodes & 2047) == 0) {
		checkUp();
	}

	searchController.nodes++;
	
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
	
	var pvMove = probePvTable();
	if (pvMove != noMove) {
		for(MoveNum = gameBoard.moveListStart[gameBoard.ply]; MoveNum < gameBoard.moveListStart[gameBoard.ply + 1]; ++MoveNum) {
			if (gameBoard.moveList[MoveNum] == pvMove) {
				gameBoard.moveScores[MoveNum] = 2000000;
				break;
			}
		}
	
	}	
	
	for(MoveNum = gameBoard.moveListStart[gameBoard.ply]; MoveNum < gameBoard.moveListStart[gameBoard.ply + 1]; ++MoveNum) {
	
		pickNextMove(MoveNum);
		
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
				if ((Move & moveFlagCapture) == 0) {
					gameBoard.searchKillers[MAXDEPTH + gameBoard.ply] = gameBoard.searchKillers[gameBoard.ply];
					gameBoard.searchKillers[gameBoard.ply] = Move;
				}
				return beta;
			}
			if ((Move & moveFlagCapture) == 0) {
				gameBoard.searchHistory[gameBoard.pieces[FROMSQ(Move)] * boardSquareNumber + TOSQ(Move)] += depth * depth;
			}
			alpha = Score;
			BestMove = Move;
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
	var score = -INFINITE;
	var currentDepth = 0;
	var line;
	var PvNum;
	var c;

	clearForSearch();
	
	for( currentDepth = 1; currentDepth <= searchController.depth; ++currentDepth) {	
	
		score = alphaBeta(-INFINITE, INFINITE, currentDepth);
					
		if(searchController.stop == BOOL.TRUE) {
			break;
		}
		
		bestScore = score;
		bestMove = probePvTable();

		console.log(bestMove);
		line = 'D:' + currentDepth + ' Best:' + printMove(bestMove) + ' Score:' + bestScore + 
				' nodes:' + searchController.nodes;
				
		PvNum = getPvLine(currentDepth);
		line += ' Pv:';
		for( c = 0; c < PvNum; ++c) {
			line += ' ' + printMove(gameBoard.pvArray[c]);
		}
		if (currentDepth != 1) {
			line += (" Ordering:" + ((searchController.fhf / searchController.fh) * 100).toFixed(2) + "%");
		}
		console.log(line);
						
	}
	
	searchController.best = bestMove;
	searchController.thinking = BOOL.FALSE;
	updateDOMStats(bestScore, currentDepth);
}

function updateDOMStats(domScore, domDepth) {

	var scoreText = "Score: " + (domScore / 100).toFixed(2);
	if (Math.abs(domScore) > MATE - MAXDEPTH) {
		scoreText = "Score: Mate in " + (MATE - (Math.abs(domScore))-1) + " moves";
	}

	$("#orderingOut").text("Ordering: " + ((searchController.fhf / searchController.fh) * 100).toFixed(2) + "%");
	$("#depthOut").text("Depth: " + domDepth);
	$("#scoreOut").text(scoreText);
	$("#nodesOut").text("Nodes: " + searchController.nodes);
	$("#timeOut").text("Time: " + (($.now() - searchController.start) / 1000).toFixed(1) + "s");
	$("#bestOut").text("BestMove: " + printMove(searchController.best));

}
