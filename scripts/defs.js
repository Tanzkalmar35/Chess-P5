/****************************************************************/
/*                                                              */
/*          General Defenitions for the project                 */
/*                                                              */
/****************************************************************/


// Giving each piece a int to just pass in this int to place pieces
// Example: if (x == 12) {do sth.} Checking if x is the king
var PIECES = { EMPTY : 0, wP: 1, wN : 2, wB : 3, wR : 4, wQ : 5, wK : 6,bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12 };

// Number of squares
var boardSquareNumber = 120;

// Making each file and rank callable
// Example: RANKS.Rank_8:7 calles the rank 8
var FILES = { FILE_A:0, FILE_B:1, FILE_C:2, FILE_D:3, FILE_E:4, FILE_F:5, FILE_G:6, FILE_H:7, FILE_NONE:8 };
var RANKS = { RANK_1:0, RANK_2:1, RANK_3:2, RANK_4:3, RANK_5:4, RANK_6:5, RANK_7:6, RANK_8:7, RANK_NONE:8 };

// Making each color (or both) easily callable
var COLOURS = { WHITE:0, BLACK:1, BOTH:3 };

var CASTLEBIT = { WKCA : 1, WQCA : 2, BKCA:4, BQCA:8 };

// Giving each square a value
var SQUARES = { 
    A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28, 
    A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98, 
    NO_SQ:99, OFFBOARD:100 
};

//callable true or false values
//example: BOOL.FALSE as false
var BOOL = { FALSE:0, TRUE: 1};

var MAXGAMEMOVES = 2048; // storing the list of moves, that the board has in the current position
var MAXPOSITIONMOVES = 256; //
var MAXDEPTH = 64; //

//creating arrays for the files and ranks
var filesBoard = new Array(boardSquareNumber);
var ranksBoard = new Array(boardSquareNumber);

var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var pieceChar = ".PNBRQKpnbrqk";
var sideChar = "wb-";
var RankChar = "12345678";
var FileChar = "abcdefgh";

function getSquareOutOfFileAndRank(file, rank) {
    return ( (21 + (file) ) + ( (rank) * 10) );
}

var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
var PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
	COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];
	
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

var knightDir = [ -8, -19, -21, -12, 8, 19, 21, 12 ];
var rookDir = [ -1, -10, 1, 10 ];
var bishopDir = [ -9, -11, 11, 9 ];
var kingDir = [ -1, -10, 1, 10, -9, -11, 11, 9 ];

var dirNum = [ 0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8 ];
var pieceDir = [ 0, 0, knightDir, bishopDir, rookDir, kingDir, kingDir, 0, knightDir, bishopDir, rookDir, kingDir, kingDir ];
var loopNonSlidePiece = [ PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0 ];
var loopNonSlideIndex = [ 0, 3 ];
var loopSlidePiece = [ PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0];
var loopSlideIndex = [ 0, 4 ];

var pieceKeys = new Array(14 * 120);
var sideKey;
var castleKeys = new Array(16);

var Sq120ToSq64 = new Array(boardSquareNumber);
var Sq64ToSq120 = new Array(64);

function RAND_32() {
    return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16) | 
    (Math.floor((Math.random() * 255) + 1) << 8) | Math.floor((Math.random() * 255) + 1);
}

//functions to translate between the two different board values (view images/explanations)

function square64(square120) {
    return Sq120ToSq64[(square120)]
}
function square120(square64) {
    return Sq64ToSq120[(square64)];
}
function pieceIndex(piece, pieceNum) {
    return (piece * 10 + pieceNum);
}

function FROMSQ(m) { return (m & 0x7F); }
function TOSQ(m) { return ( (m >> 7) & 0x7F); }
function CAPTURED(m) { return ( (m >> 14) & 0xF); }
function PROMOTED(m) { return ( (m >> 20) & 0xF); }

var moveFlagEnPassant = 0x40000;
var moveFlagPawnStart = 0x80000;
var moveFlagCastle = 0x100000;

var moveFlagCaptured = 0x7C000;
var moveFlagPromotion = 0xF00000;

var noMove = 0;

function squareOffBoard(square) {
    if (filesBoard[square] == SQUARES.OFFBOARD) return BOOL.TRUE;
    return BOOL.FALSE;
}
