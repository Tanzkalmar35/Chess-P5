$("#SetFen").click(function () {
	var fenStr = $("#fenIn").val();	
	newGame(fenStr);
});

$("#takeBackButton").click(function () {
	if (gameBoard.hisPly > 0) {
		takeMove();
		gameBoard.ply = 0;
		setInitialBoardPieces();
	}
});

$("#newGameButton").click(function () {
	newGame(START_FEN);
});

$("#flipBoardButton").click(function () {

	if (gameBoard.flipped == BOOL.FALSE) {
		gameBoard.flipped = BOOL.TRUE;
	} else if (gameBoard.flipped == BOOL.TRUE) {
		gameBoard.flipped = BOOL.FALSE;
	}
	if (START_FEN == "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr w KQkq - 0 1") {
		switchSide("black");
		newGame(START_FEN);
	} else if (START_FEN == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
		switchSide("white");
		newGame(START_FEN);
	}
});

function newGame(fenString) {
	ParseFen(fenString);
	printBoard();
	setInitialBoardPieces();
	checkAndSet();
	if (gameBoard.flipped == BOOL.TRUE) {
		preSearch();
	}
	resetTimer();
}

function clearAllPieces() {
	$(".piece").remove();
}

function setInitialBoardPieces() {
	var square;
	var square120;
	var file, rank;
	var rankName;
	var fileName;
	var imageString;
	var pieceFileName;
	var piece;

	clearAllPieces();

	for (square = 0; square < 64; square++) {
		square120 = SQ120(square);
		piece = gameBoard.pieces[square120];

		if (piece >= PIECES.wP && piece <= PIECES.bK) {
			addPieceToGUI(square120, piece)
		}
	}
}

function deSelectSquare(square) {
	$(".square").each(function(index) {
		if (pieceIsOnSquare(square, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
			$(this).removeClass("squareSelected");
		}
	});
}

function setSquareSelected(square) {
	$(".square").each(function(index) {
		if (pieceIsOnSquare(square, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
			$(this).addClass("squareSelected");
		}
	});
}

function clickedSquare(pageX, pageY) {
	console.log("clickedSquare at " + pageX + ", " + pageY);

	var position = $("#board").position();
	var workedX = Math.floor(position.left);
	var workedY = Math.floor(position.top);

	pageX = Math.floor(pageX);
	pageY = Math.floor(pageY);

	var file = Math.floor((pageX - workedX) / 80);
	var rank = 7 - Math.floor((pageY - workedY) / 80);

	var square = fileAndRankToSquare(file, rank);

	console.log("Clicked square: " + printSquare(square));

	setSquareSelected(square);

	return square;

}

$(document).on("click", ".piece", function (e) {
	console.log("piece click");
	if (gameBoard.flipped == BOOL.FALSE) {
		if (gameBoard.side == COLOURS.WHITE) {
			if (userMove.from == SQUARES.NO_SQ) {
				userMove.from = clickedSquare(e.pageX, e.pageY);			
			} else {
				userMove.to = clickedSquare(e.pageX, e.pageY);
			}
		
			makeUserMove();
		}
	} else if (gameBoard.flipped == BOOL.TRUE) {
		if (gameBoard.side == COLOURS.BLACK) {
			if (userMove.from == SQUARES.NO_SQ) {
				userMove.from = clickedSquare(e.pageX, e.pageY);			
			} else {
				userMove.to = clickedSquare(e.pageX, e.pageY);
			}
			makeUserMove();
		}
	}

});

$(document).on("click", ".square", function (e) {
	if (userMove.from != SQUARES.NO_SQ) {
		userMove.to = clickedSquare(e.pageX, e.pageY);
		makeUserMove();
	}
});

function makeUserMove() {
	if (userMove.from != SQUARES.NO_SQ && userMove.to != SQUARES.NO_SQ) {

		console.log("User move: " + printSquare(userMove.from) + printSquare(userMove.to));

		console.log(userMove.from + "---" + userMove.to);
		var parsed = parseMove(userMove.from, userMove.to);
		if (parsed != noMove) {
			console.log("move made");
			makeMove(parsed);
			printBoard();
			movePieceInGUI(parsed);
			checkAndSet();
			preSearch();
		} else {
			console.log("move not made");
		}
 
		deSelectSquare(userMove.from);
		deSelectSquare(userMove.to);

		userMove.from = SQUARES.NO_SQ;
		userMove.to = SQUARES.NO_SQ;

	}
}

function pieceIsOnSquare(square, top, left) {
	if ((ranksBoard[square] == 7 - Math.round(top/80)) && filesBoard[square] == Math.round(left/80)) {
		return BOOL.TRUE;
	}
	return BOOL.FALSE;
}

function removePieceFromGUI(square) {
	$(".piece").each(function(index) {
		if (pieceIsOnSquare(square, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
			$(this).remove();
		}
	});
}

function addPieceToGUI(square, piece) {
	var file = filesBoard[square];
	var rank = ranksBoard[square];

	rankName = "rank" + (rank + 1);
	fileName = "file" + (file + 1);

	var pieceFileName = "images/pieces/" + sideChar[pieceCol[piece]] + pieceChar[piece].toUpperCase() + ".png";
	var imageString = "<image src=\"" + pieceFileName + "\" class=\"piece " + rankName + " " + fileName + "\"/>";
	$("#board").append(imageString);

}

function movePieceInGUI(move) {

	var from = FROMSQ(move);
	var to = TOSQ(move);

	if (move & moveFlagEnPassant) {
		var enPassantRemove;
		if (gameBoard.side == COLOURS.BLACK) {
			enPassantRemove = to - 10;
		} else {
			enPassantRemove = to + 10;
		}
		removePieceFromGUI(enPassantRemove);
	} else if (CAPTURED(move)) {
		removePieceFromGUI(to);
	}

	var file = filesBoard[to];
	var rank = ranksBoard[to];

	rankName = "rank" + (rank + 1);
	fileName = "file" + (file + 1);

	$(".piece").each(function(index) {
		if (pieceIsOnSquare(from, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
			$(this).removeClass();
			$(this).addClass("piece " + rankName + " " + fileName);
		}
	});

	if (move & moveFlagCastle) {
		switch(to) {
			case SQUARES.G1: removePieceFromGUI(SQUARES.H1); addPieceToGUI(SQUARES.F1, PIECES.wR); break;
			case SQUARES.C1: removePieceFromGUI(SQUARES.A1); addPieceToGUI(SQUARES.D1, PIECES.wR); break;
			case SQUARES.G8: removePieceFromGUI(SQUARES.H8); addPieceToGUI(SQUARES.F8, PIECES.bR); break;
			case SQUARES.C8: removePieceFromGUI(SQUARES.A8); addPieceToGUI(SQUARES.D8, PIECES.bR); break;
		}
	} else if (PROMOTED(move)) {
		removePieceFromGUI(to);
		addPieceToGUI(to, PROMOTED(move));
	}
}

// checks if it makes sense to continue to play
function drawMaterial() {

	if (gameBoard.pieceNumber[PIECES.wP] != 0 || gameBoard.pieceNumber[PIECES.bP] != 0) {
		return BOOL.FALSE;
	}
	if (gameBoard.pieceNumber[PIECES.wQ] != 0 || gameBoard.pieceNumber[PIECES.bQ] != 0 || gameBoard.pieceNumber[PIECES.wR] != 0 || gameBoard.pieceNumber[PIECES.bR] != 0 ) {
		return BOOL.FALSE;
	}
	if (gameBoard.pieceNumber[PIECES.wB] > 1 || gameBoard.pieceNumber[PIECES.bB] > 1) {
		return BOOL.FALSE;
	}
	if (gameBoard.pieceNumber[PIECES.wN] > 1 || gameBoard.pieceNumber[PIECES.bN] > 1) {
		return BOOL.FALSE;
	}
	if (gameBoard.pieceNumber[PIECES.wN] != 0 || gameBoard.pieceNumber[PIECES.wB] != 0) {
		return BOOL.FALSE;
	}
	if (gameBoard.pieceNumber[PIECES.bN] != 0 || gameBoard.pieceNumber[PIECES.bB] != 0) {
		return BOOL.FALSE;
	}

	return BOOL.TRUE;
}
//checks for remis by repitition
function threeFoldRepitition() {

	var i = 0, r = 0;

	for (i = 0; i < gameBoard.hisPly; i++) {
		if (gameBoard.history[i].positionKey == gameBoard.positionKey) {
			r++;
		}
	}
	return r;
}

function checkResult() {

	if (gameBoard.fiftyMove >= 100) {
		$("#gameStatus").text("Draw by fiftyMove");
		return BOOL.TRUE;
	}

	if (threeFoldRepitition() >= 2) {
		$("#gameStatus").text("Draw by repitition");
		return BOOL.TRUE;
	}

	if (drawMaterial() == BOOL.TRUE) {
		$("#gameStatus").text("Draw by insufficient material");
		return BOOL.TRUE;
	}

	generateMoves();

	var moveNumber = 0;
	var found = 0;

	for (moveNumber = gameBoard.moveListStart[gameBoard.ply]; moveNumber < gameBoard.moveListStart[gameBoard.ply + 1]; moveNumber++) {

		if (makeMove(gameBoard.moveList[moveNumber]) == BOOL.FALSE) {
			continue;
		}
		found++;
		takeMove();
		break;
	}

	if (found != 0) {
		return BOOL.FALSE;
	}

	var inCheck = SquareAttacked(gameBoard.pieceList[PIECEINDEX(Kings[gameBoard.side],0)], gameBoard.side^1);

	if (inCheck == BOOL.TRUE) {
		if (gameBoard.side == COLOURS.WHITE) {
			$("#gameStatus").text("Black won by checkmate");
			return BOOL.TRUE;
		} else {
			$("#gameStatus").text("White won by checkmate");
			return BOOL.TRUE;
		}
	} else {
		$("#gameStatus").text("Draw by stalemate");
		return BOOL.TRUE;
	}

	return BOOL.FALSE;
}

function checkAndSet() {

	if (checkResult() == BOOL.TRUE) {
		gameController.gameOver = BOOL.TRUE;
	} else {
		gameController.gameOver = BOOL.FALSE;
		$("#gameStatus").text("");
	}

}

function preSearch() {
	if (gameController.gameOver == BOOL.FALSE) {
		searchController.thinking = BOOL.TRUE;
		setTimeout( function() { startSearch(); }, 200 );
	}
}

$("#searchButton").click( function() {
	gameController.playerSide = gameController.side ^ 1;
	preSearch();
});

function startSearch() {

	searchController.depth = MAXDEPTH;
	var time = $.now();
	var thinkingTime = $("#thinkingTimeChoice").val();

	searchController.time = parseInt(thinkingTime) * 1000;
	searchPosition();

	makeMove(searchController.best);
	movePieceInGUI(searchController.best);
	checkAndSet();

}

function reverseString(fenString) {
	var newFenString = "";

	for (var i = fenString.length - 1; i >= 0; i--) {
		newFenString += fenString[i];
	}
	
	return newFenString;

}

function switchSide(sideString) {
	if (sideString = "white") {
		side = "w";
		gameBoard.side == COLOURS.WHITE;
	} else if (sideString = "black") {
		side = "b";
		gameBoard.side == COLOURS.BLACK;
	}
}
