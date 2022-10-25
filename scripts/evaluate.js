var pawnTable = [
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];


var knightTable = [
0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0		
];

var bishopTable = [
0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];

var rookTable = [
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0		
];

var bishopPair = 40;


function evalPosition() {
	
	var score = gameBoard.material[COLOURS.WHITE] - gameBoard.material[COLOURS.BLACK];
	
	var piece;
	var square;
	var pieceNumber;
	
	piece = PIECES.wP;
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score += pawnTable[SQ64(square)];
	}
	
	piece = PIECES.bP;
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score -= pawnTable[MIRROR64(SQ64(square))];
	}
	
	piece = PIECES.wN;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score += knightTable[SQ64(square)];
	}	

	piece = PIECES.bN;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score -= knightTable[MIRROR64(SQ64(square))];
	}			
	
	piece = PIECES.wB;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score += bishopTable[SQ64(square)];
	}	

	piece = PIECES.bB;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score -= bishopTable[MIRROR64(SQ64(square))];
	}
	
	piece = PIECES.wR;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score += rookTable[SQ64(square)];
	}	

	piece = PIECES.bR;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score -= rookTable[MIRROR64(SQ64(square))];
	}
	
	piece = PIECES.wQ;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score += rookTable[SQ64(square)];
	}	

	piece = PIECES.bQ;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score -= rookTable[MIRROR64(SQ64(square))];
	}	
	
	if(gameBoard.pieceNumber[PIECES.wB] >= 2) {
		score += bishopPair;
	}
	
	if(gameBoard.pieceNumber[PIECES.bB] >= 2) {
		score -= bishopPair;
	}

	//checking for hanging pieces

	var queenNotHanging = SquareAttacked(gameBoard.pieceList[PIECEINDEX(Queens[gameBoard.side],0)], gameBoard.side);
	
	if (!queenNotHanging) {
		score -= 10; 
	}

	var rookNotHanging = SquareAttacked(gameBoard.pieceList[PIECEINDEX(Rooks[gameBoard.side],0)], gameBoard.side);
	
	if (!rookNotHanging) {
		score -= 5;
	}

	var BishopNotHanging = SquareAttacked(gameBoard.pieceList[PIECEINDEX(Bishops[gameBoard.side],0)], gameBoard.side);
	
	if (!BishopNotHanging) {
		score -= 3.3;
	}

	var knightNotHanging = SquareAttacked(gameBoard.pieceList[PIECEINDEX(Knights[gameBoard.side],0)], gameBoard.side);
	
	if (!knightNotHanging) {
		score -= 3;
	}

	var pawnNotHanging = SquareAttacked(gameBoard.pieceList[PIECEINDEX(Pawns[gameBoard.side],0)], gameBoard.side);
	
	if (!pawnNotHanging) {
		score -= 1;
	}

	if(gameBoard.side == COLOURS.WHITE) {
		return score;
	} else {
		return -score;
	}

}































   
   
   
   
   
   
   
















