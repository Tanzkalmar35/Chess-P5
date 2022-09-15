function printSquare(sq) {
	return (FileChar[filesBoard[sq]] + RankChar[ranksBoard[sq]]);
}

function PrMove(move) {	
	var MvStr;

	console.log(move);
	
	var ff = filesBoard[FROMSQ(move)];
	var rf = ranksBoard[FROMSQ(move)];
	var ft = filesBoard[TOSQ(move)];
	var rt = ranksBoard[TOSQ(move)];

	MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];

	var promoted = PROMOTED(move);

	if(promoted != PIECES.EMPTY) {
		var pchar = 'q';
		if(PieceKnight[promoted] == BOOL.TRUE) {
			pchar = 'n';
		} else if(PieceRookQueen[promoted] == BOOL.TRUE && PieceBishopQueen[promoted] == BOOL.FALSE)  {
			pchar = 'r';
		} else if(PieceRookQueen[promoted] == BOOL.FALSE && PieceBishopQueen[promoted] == BOOL.TRUE)   {
			pchar = 'b';
		}
		MvStr += pchar;
	}
	return MvStr;
}

function printMoveList() {

	var index;
	var move;
	var num = 1;
	console.log('MoveList:');

	for(index = gameBoard.moveListStart[gameBoard.ply]; index < gameBoard.moveListStart[gameBoard.ply+1]; ++index) {
		move = gameBoard.moveList[index];
		console.log('Move:' + num + ':' + PrMove(move));
		num++;
	}
}