function printSquare(square) {
	return (fileChar[filesBoard[square]] + rankChar[ranksBoard[square]]);
}

function printMove(move) {	
	var moveString;
	
	var fromFile = filesBoard[FROMSQ(move)];
	var fromRank = ranksBoard[FROMSQ(move)];
	var toFile = filesBoard[TOSQ(move)];
	var toRank = ranksBoard[TOSQ(move)];
	
	moveString = fileChar[fromFile] + rankChar[fromRank] + fileChar[toFile] + rankChar[toRank];
	
	var promoted = PROMOTED(move);

	if(promoted != PIECES.EMPTY) {
		var pieceChar = 'q';
		if(pieceKnight[promoted] == BOOL.TRUE) {
			pieceChar = 'n';
		} else if(pieceRookQueen[promoted] == BOOL.TRUE && pieceBishopQueen[promoted] == BOOL.FALSE)  {
			pieceChar = 'r';
		} else if(pieceRookQueen[promoted] == BOOL.FALSE && pieceBishopQueen[promoted] == BOOL.TRUE)   {
			pieceChar = 'b';
		}
		moveString += pieceChar;
	}
	return moveString;
}

function printMoveList() {

	var move;
	var number = 1;
	console.log('MoveList:');

	for(var i = gameBoard.moveListStart[gameBoard.ply]; i < gameBoard.moveListStart[gameBoard.ply+1]; ++i) {
		move = gameBoard.moveList[index];
		console.log('Move:' + number + ':' + printMove(move));
		number++;
	}
	console.log('End MoveList');
}




















































