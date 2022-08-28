"use strict";

import {canvas, messages, ctx, sideSize, tiles, highlights, pieces} from "./board.js";
import { Piece } from "./piece.js"
import {getSquares, getPieceAt} from "./pieceMovement.js";


let moving = null;
let validMoves = null;
let turn = false;
let winScreen = false;
let frameHandle;

/*************************************************************** On click handling ************************************************/

//eventlistener for click on piece
addEventListener("mousedown", e => {
  if (winScreen) {
    frameHandle = requestAnimationFrame(frame);
    winScreen = false;
    messages.innerText = "";
  }
  if (moving === null) {
    const rect = canvas.getBoundingClientRect();
    moving = getPieceAt(Math.floor((e.clientX - rect.x) / sideSize), Math.floor((e.clientY - rect.y) / sideSize));
    if (moving === undefined || (moving.color === "White") === turn)
      moving = null;
    else
      validMoves = getSquaresChecked(moving);
  }
});
//eventlistener for piece following the cursor
addEventListener("mousemove", e => {
  if (moving !== null) {
    const rect = canvas.getBoundingClientRect();
    moving.moveDispTo(e.clientX - rect.x, e.clientY - rect.y);
  }
});
//eventlistener for moving the piece
addEventListener("mouseup", e => {
  if (moving !== null) {
    const rect = canvas.getBoundingClientRect();
    const tileX = Math.floor((e.clientX - rect.x) / sideSize);
    const tileY = Math.floor((e.clientY - rect.y) / sideSize);
    if (validMoves.find(m => m[0] === tileX && m[1] === tileY) !== undefined) {
      const index = pieces.findIndex(p => p.x === tileX && p.y === tileY);
      if (index > -1)
        pieces.splice(index, 1);
      moving.moved = true;
      if (moving.type === "King") {
        if (tileX - moving.x === 2) {
          let rook = getPieceAt(7, moving.y);
          rook.moveTo(tileX - 1, moving.y);
          rook.reset();
        }
        if (tileX - moving.x === -2) {
          let rook = getPieceAt(0, moving.y);
          rook.moveTo(tileX + 1, moving.y);
          rook.reset();
        }
      }
      moving.moveTo(tileX, tileY);
      turn = !turn;
    }
    moving.reset();
    moving = null;
    let checkmate = true;
    for (const piece of pieces) {
      if ((piece.color !== "White") === turn && getSquaresChecked(piece).length) {
        checkmate = false;
        break;
      }
    }
    for (let x = 0; x < 8; ++x)
      for (let y = 0; y < 8; ++y)
        highlights[y][x] = "#00000000";
    if (checkmate) {
      winScreen = true;
      cancelAnimationFrame(frameHandle);
      draw();
      messages.innerText = (turn ? "White" : "Black") + " Wins!" + "\nClick to play again";
      reset();
    } else if (inCheck())
      messages.innerText = "Check!";
    else
      messages.innerText = "";
  }
});

frameHandle = requestAnimationFrame(frame);

/************************************************************************************************ check logic ****************/
function getSquaresChecked(piece) {
  validMoves = getSquares(piece);
  for (const move of validMoves) {
    let x = piece.x;
    let y = piece.y;
    const index = pieces.findIndex(p => p.x === move[0] && p.y === move[1]);
    let removed;
    if (index !== -1)
      removed = pieces.splice(index, 1)[0];
    piece.moveTo(move[0], move[1]);
    if (inCheck())
      move[2] = "rm";
    else
      highlights[move[1]][move[0]] = move[2];
    piece.moveTo(x, y);
    if (removed !== undefined)
      pieces.splice(index, 0, removed);
  }
  return validMoves.filter(a => a[2] !== "rm");
}
//checking for checks
function inCheck() {
  let king = pieces.find(p => p.type === "King" && (p.color !== "White") === turn);
  if (king === undefined)
    return true;
  for (const piece of pieces)
    if (getSquares(piece).find(a => a[0] === king.x && a[1] === king.y))
      return true;
  return false;
}
/**************************************************************** helper functions ****************************************************************/
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < 8; ++x)
    for (let y = 0; y < 8; ++y) {
      ctx.fillStyle = tiles[y][x];
      ctx.fillRect(x * sideSize, y * sideSize, sideSize, sideSize);
      ctx.fillStyle = highlights[y][x];
      ctx.fillRect(x * sideSize, y * sideSize, sideSize, sideSize);
    }

  for (const piece of pieces)
    piece.draw(ctx);
}

function frame() {
  draw();

  frameHandle = requestAnimationFrame(frame);
}
// function to reset the game to default
function reset() {
  pieces.splice(0, pieces.length);
  pieces.splice(
    0, 0,
    Piece(0, 0, "Rook", "Black"), Piece(1, 0, "Knight", "Black"), Piece(2, 0, "Bishop", "Black"), Piece(3, 0, "Queen", "Black"), Piece(4, 0, "King", "Black"), Piece(5, 0, "Bishop", "Black"), Piece(6, 0, "Knight", "Black"), Piece(7, 0, "Rook", "Black"),
    Piece(0, 1, "Pawn", "Black"), Piece(1, 1, "Pawn", "Black"), Piece(2, 1, "Pawn", "Black"), Piece(3, 1, "Pawn", "Black"), Piece(4, 1, "Pawn", "Black"), Piece(5, 1, "Pawn", "Black"), Piece(6, 1, "Pawn", "Black"), Piece(7, 1, "Pawn", "Black"),
    Piece(0, 6, "Pawn", "White"), Piece(1, 6, "Pawn", "White"), Piece(2, 6, "Pawn", "White"), Piece(3, 6, "Pawn", "White"), Piece(4, 6, "Pawn", "White"), Piece(5, 6, "Pawn", "White"), Piece(6, 6, "Pawn", "White"), Piece(7, 6, "Pawn", "White"),
    Piece(0, 7, "Rook", "White"), Piece(1, 7, "Knight", "White"), Piece(2, 7, "Bishop", "White"), Piece(3, 7, "Queen", "White"), Piece(4, 7, "King", "White"), Piece(5, 7, "Bishop", "White"), Piece(6, 7, "Knight", "White"), Piece(7, 7, "Rook", "White")
  );
}