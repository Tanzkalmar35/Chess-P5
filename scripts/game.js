$(function() {
	init();
	console.log("Main Init Called");	
	initStarterBoard(START_FEN);
});

function initStarterBoard(fenString) {
	ParseFen(fenString);
	printBoard();
	setInitialBoardPieces();
}

function initFilesRanksBoard() {
	
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var square = SQUARES.A1;
	
	for(var i = 0; i < boardSquareNumber; ++i) {
		filesBoard[i] = SQUARES.OFFBOARD;
		ranksBoard[i] = SQUARES.OFFBOARD;
	}
	
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			square = fileAndRankToSquare(file,rank);
			filesBoard[square] = file;
			ranksBoard[square] = rank;
		}
	}
}

function initHashKeys() {
	
	for(var i = 0; i < 14 * 120; ++i) {				
		pieceKeys[i] = RAND_32();
	}
	
	sideKey = RAND_32();
	
	for(var i = 0; i < 16; ++i) {
		castleKeys[i] = RAND_32();
	}
}

function initSq120To64() {

	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var square = SQUARES.A1;
	var sq64 = 0;

	for(var i = 0; i < boardSquareNumber; ++i) {
		Sq120ToSq64[i] = 65;
	}
	
	for(var i = 0; i < 64; ++i) {
		Sq64ToSq120[i] = 120;
	}
	
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			square = fileAndRankToSquare(file,rank);
			Sq64ToSq120[sq64] = square;
			Sq120ToSq64[square] = sq64;
			sq64++;
		}
	}

}

function initBoardVariables() {

	for(var i = 0; i < MAXGAMEMOVES; ++i) {
		gameBoard.history.push( {
			move : noMove,
			castlePerm : 0,
			enPas : 0,
			fiftyMove : 0,
			posKey : 0
		});
	}	
	
	for(var i = 0; i < PVENTRIES; ++i) {
		gameBoard.pvTable.push({
			move : noMove,
			posKey : 0
		});
	}
}

function initBoardSquares() {
	var light = 1;
	var rankName;
	var fileName;
	var divString;
	var rankIterator;
	var fileIterator;
	var lightString;

	for (rankIterator = RANKS.RANK_8; rankIterator >= RANKS.RANK_1; rankIterator--) {
		light ^= 1;
		rankName = "rank" + (rankIterator + 1);
		for (fileIterator = FILES.FILE_A; fileIterator <= FILES.FILE_H; fileIterator++) {
			fileName = "file" + (fileIterator + 1);
			if (light == 0) {
				lightString = "lightSquare";
			} else {
				lightString = "darkSquare";
			}
			light ^= 1;
			divString = "<div class=\"square " + rankName + " " + fileName + " " + lightString + "\"/>";
			$("#board").append(divString);
		}
	}
}

function init() {
	console.log("init() called");
	initFilesRanksBoard();
	initHashKeys();
	initSq120To64();
	initBoardVariables();
	initMvvLva();
	initBoardSquares();
}













































