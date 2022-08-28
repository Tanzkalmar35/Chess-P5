import { Piece } from "./piece.js"

//draing the board
const canvas = document.getElementById("board");
const messages = document.getElementById("messages");
const ctx = canvas.getContext("2d");
const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
const sideSize = Piece.prototype.tileSize = size / 8;
const tiles = new Array(8).fill().map(() => new Array(8).fill(""));
const highlights = new Array(8).fill().map(() => new Array(8).fill("#00000000"));
const pieces = [
  // placing the pieces into the starter squares
  Piece(0, 0, "Rook", "Black"), Piece(1, 0, "Knight", "Black"), Piece(2, 0, "Bishop", "Black"), Piece(3, 0, "Queen", "Black"), Piece(4, 0, "King", "Black"), Piece(5, 0, "Bishop", "Black"), Piece(6, 0, "Knight", "Black"), Piece(7, 0, "Rook", "Black"),
  Piece(0, 1, "Pawn", "Black"), Piece(1, 1, "Pawn", "Black"), Piece(2, 1, "Pawn", "Black"), Piece(3, 1, "Pawn", "Black"), Piece(4, 1, "Pawn", "Black"), Piece(5, 1, "Pawn", "Black"), Piece(6, 1, "Pawn", "Black"), Piece(7, 1, "Pawn", "Black"),
  Piece(0, 6, "Pawn", "White"), Piece(1, 6, "Pawn", "White"), Piece(2, 6, "Pawn", "White"), Piece(3, 6, "Pawn", "White"), Piece(4, 6, "Pawn", "White"), Piece(5, 6, "Pawn", "White"), Piece(6, 6, "Pawn", "White"), Piece(7, 6, "Pawn", "White"),
  Piece(0, 7, "Rook", "White"), Piece(1, 7, "Knight", "White"), Piece(2, 7, "Bishop", "White"), Piece(3, 7, "Queen", "White"), Piece(4, 7, "King", "White"), Piece(5, 7, "Bishop", "White"), Piece(6, 7, "Knight", "White"), Piece(7, 7, "Rook", "White"),
];

canvas.width = size;
canvas.height = size;

ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.font = sideSize + "px Georgia";

for (let x = 0; x < 8; ++x)
  for (let y = 0; y < 8; ++y)
    tiles[y][x] = y % 2 === x % 2 ? "#8bbdd9" : "#298fca";

export {canvas, messages, ctx, size, sideSize, tiles, highlights, pieces};