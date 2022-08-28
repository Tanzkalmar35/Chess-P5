import {pieces} from "./board.js";

function getPieceAt(x, y) {
    return pieces.find(p => p.x === x && p.y === y);
  }

function getSquares(piece) {
    let validMoves = [];
    switch (piece.type) {
      case "Pawn":
        const n = piece.color === "White" ? 1 : -1;
        const r = piece.color === "White" ? 6 : 1;
        if (getPieceAt(piece.x, piece.y - 1 * n) === undefined) {
          validMoves.push([piece.x, piece.y - 1 * n, "#ba55d3"]);
          if (getPieceAt(piece.x, piece.y - 2 * n) === undefined && piece.y === r)
            validMoves.push([piece.x, piece.y - 2 * n, "#800080"]);
        }
        const left = getPieceAt(piece.x - 1, piece.y - 1 * n);
        const right = getPieceAt(piece.x + 1, piece.y - 1 * n);
        if (left !== undefined && left.color !== piece.color)
          validMoves.push([piece.x - 1, piece.y - 1 * n, "#ba55d3"]);
        if (right !== undefined && right.color !== piece.color)
          validMoves.push([piece.x + 1, piece.y - 1 * n, "#800080"]);
        break;
      case "Knight":
        const moves = [
          [piece.x + 2, piece.y + 1], [piece.x - 2, piece.y + 1],
          [piece.x + 2, piece.y - 1], [piece.x - 2, piece.y - 1],
          [piece.x + 1, piece.y + 2], [piece.x - 1, piece.y + 2],
          [piece.x + 1, piece.y - 2], [piece.x - 1, piece.y - 2],
        ];
        for (const m of moves) {
          const p = getPieceAt(...m);
          if (p === undefined)
            validMoves.push(m.concat("#ba55d3"));
          else if (p.color !== piece.color)
            validMoves.push(m.concat("#800080"));
        }
        break;
      case "Bishop":
        for (let dx = -1; dx < 2; dx += 2)
          for (let dy = -1; dy < 2; dy += 2) {
            let x = piece.x + dx;
            let y = piece.y + dy;
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
              const p = getPieceAt(x, y);
              if (p !== undefined) {
                if (p.color !== piece.color)
                  validMoves.push([x, y, "#ba55d3"]);
                break;
              }
              validMoves.push([x, y, "#800080"]);
              x += dx;
              y += dy;
            }
          }
          break;
      case "Rook":
        for (let d = -1; d < 2; d += 2) {
          let dx = d;
          let dy = 0;
          let x = piece.x + dx;
          let y = piece.y + dy;
          while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            const p = getPieceAt(x, y);
            if (p !== undefined) {
              if (p.color !== piece.color)
                validMoves.push([x, y, "#ba55d3"]);
              break;
            }
            validMoves.push([x, y, "#800080"]);
            x += dx;
            y += dy;
          }
          dx = 0;
          dy = d;
          x = piece.x + dx;
          y = piece.y + dy;
          while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            const p = getPieceAt(x, y);
            if (p !== undefined) {
              if (p.color !== piece.color)
                validMoves.push([x, y, "#ba55d3"]);
              break;
            }
            validMoves.push([x, y, "#800080"]);
            x += dx;
            y += dy;
          }
        }
        break;
      case "Queen":
        for (let dx = -1; dx < 2; ++dx)
          for (let dy = -1; dy < 2; ++dy) {
            let x = piece.x + dx;
            let y = piece.y + dy;
            while (x >= 0 && x < 8 && y >= 0 && y < 8) {
              const p = getPieceAt(x, y);
              if (p !== undefined) {
                if (p.color !== piece.color)
                  validMoves.push([x, y, "#ba55d3"]);
                break;
              }
              validMoves.push([x, y, "#800080"]);
              x += dx;
              y += dy;
            }
          }
        break;
      case "King":
        for (let dx = -1; dx < 2; ++dx)
          for (let dy = -1; dy < 2; ++dy) {
            const x = piece.x + dx;
            const y = piece.y + dy;
            const p = getPieceAt(x, y);
            if (p === undefined)
              validMoves.push([x, y, "#ba55d3"]);
            else if (p.color !== piece.color)
              validMoves.push([x, y, "#800080"]);
          }
        if (!piece.moved) {
          let left = getPieceAt(0, piece.y);
          let right = getPieceAt(7, piece.y);
          if (left !== undefined && !left.moved && getPieceAt(1, piece.y) === undefined && getPieceAt(2, piece.y) === undefined && getPieceAt(3, piece.y) === undefined)
            validMoves.push([piece.x - 2, piece.y, "#ba55d3"])
          if (right !== undefined && !right.moved && getPieceAt(6, piece.y) === undefined && getPieceAt(5, piece.y) === undefined)
            validMoves.push([piece.x + 2, piece.y, "#800080"])
        }
        break;
    }
    validMoves = validMoves.filter(m => m[0] >= 0 && m[0] < 8 && m[1] >= 0 && m[1] < 8);
    return validMoves;
}

export { getSquares, getPieceAt };