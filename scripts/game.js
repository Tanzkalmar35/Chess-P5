$(function() {
  init();
  console.log("Main Init Called");
  parseFen(START_FEN);
  printBoardToConsole();
  generateMoves();
});

function initFilesAndRanksBoard() {
  var file = FILES.FILE_A;
  var rank = RANKS.RANK_1;
  var square = SQUARES.A1;

  for (var i = 0; i <= boardSquareNumber; i++) {
    filesBoard[i] = SQUARES.OFFBOARD;
    ranksBoard[i] = SQUARES.OFFBOARD;
  }
  for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank++) {
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
      square = getSquareOutOfFileAndRank(file, rank);
      filesBoard[square] = file;
      ranksBoard[square] = rank;
    }
  }
}

function initHashKeys() {

  for (var i = 0; i < 14 * 120; i++) {
    pieceKeys[i] = RAND_32();
  }

  sideKey = RAND_32();

  for (var i = 0; i < 16; i++) {
    castleKeys[i] = RAND_32();
  }

}

function initSquare120To64() {
  var file = FILES.FILE_A;
  var rank = RANKS.RANK_1;
  var square = SQUARES.A1;
  var square64 = 0;

  for (var i = 0; i < boardSquareNumber; i++) {
    square120To64[i] = 65;
  }

  for (var i = 0; i < 64; i++) {
    square64To120[i] = 120;
  }

  for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank++) {
    for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
      square = getSquareOutOfFileAndRank(file, rank);
      square64To120[square64] = square;
      square120To64[square] = square64;
      square64++;
    }
  }

}

function init() {
  console.log("init() called");
  initFilesAndRanksBoard();
  initHashKeys();
  initSquare120To64();
}
