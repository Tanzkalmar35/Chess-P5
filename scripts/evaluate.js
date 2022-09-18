var PawnTable = [
    0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
    10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
    5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
    0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
    5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
    10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
    20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
    0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
    ];
    
    
    var KnightTable = [
    0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
    0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
    0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
    0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
    5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
    5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
    0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
    0	,	0	,	0	,	0	,	0	,	0	,	0	,	0		
    ];
    
    var BishopTable = [
    0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
    0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
    0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
    0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
    0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
    0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
    0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
    0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
    ];
    
    var RookTable = [
    0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
    0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
    0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
    0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
    0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
    0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
    25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
    0	,	0	,	5	,	10	,	10	,	5	,	0	,	0		
    ];
    
    var BishopPair = 40;

function evaluatePosition() {
    var score = gameBoard.material[COLOURS.WHITE] - gameBoard.material[COLOURS.BLACK];

    var piece;
    var square;
    var pieceNumber;

    piece = PIECES.wP;
    for (pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; pieceNumber++) {
        square = gameBoard.pieceList[PIECEINDEX(piece, pieceNumber)];
        score += PawnTable[square64(square)];
    }

    piece = PIECES.bP;
    for (pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; pieceNumber++) {
        square = gameBoard.pieceList[PIECEINDEX(piece, pieceNumber)];
        score -= PawnTable[MIRROR64(square64(square))];
    }

    piece = PIECES.wN;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score += KnightTable[square64(square)];
	}	

	piece = PIECES.bN;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score -= KnightTable[MIRROR64(square64(square))];
	}			
	
	piece = PIECES.wB;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score += BishopTable[square64(square)];
	}	

	piece = PIECES.bB;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score -= BishopTable[MIRROR64(square64(square))];
	}
	
	piece = PIECES.wR;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score += RookTable[square64(square)];
	}	

	piece = PIECES.bR;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score -= RookTable[MIRROR64(square64(square))];
	}
	
	piece = PIECES.wQ;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score += RookTable[square64(square)];
	}	

	piece = PIECES.bQ;	
	for(pieceNumber = 0; pieceNumber < gameBoard.pieceNumber[piece]; ++pieceNumber) {
		square = gameBoard.pieceList[PIECEINDEX(piece,pieceNumber)];
		score -= RookTable[MIRROR64(square64(square))];
    }

    if (gameBoard.pieceNumber[PIECES.wB] >= 2) {
        score += BishopPair;
    }
    if (gameBoard.pieceNumber[PIECES.bB] >= 2) {
        score -= BishopPair;
    }

    if (gameBoard.side == COLOURS.WHITE) {
        return score;
    } else {
        return -score;
    }
}