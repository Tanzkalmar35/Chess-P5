function Piece(x, y, type, color) {
    let char;
    let moved = false;
    switch (type) {
      //adding cases for each piece, so we can call them easily later
      //each piece has an image added via code
      case "Pawn":
        char = "\u2659";
        break;
      case "Knight":
        char = "\u265E";
        break;
      case "Bishop":
        char = "\u265D";
        break;
      case "Rook":
        char = "\u265C";
        break;
      case "Queen":
        char = "\u265B";
        break;
      case "King":
        char = "\u265A";
        break;
    }
    //coloring and positioning the starter pieces
    let fill = color === "White" ? "#fff" : "#000";
    let size = Piece.prototype.tileSize;
    let half = size / 2;
    let dispX = x * size + half;
    let dispY = y * size + half - 4;
  
    return { 
      //moving the pieces
      type: type,
      color: color,
      get x() { return x; },
      get y() { return y; },
      get moved() { return moved; },
      set moved(b) { moved = b; },
      moveTo(nx, ny) {
        x = nx;
        y = ny;
      },
      moveDispTo(nx, ny) {
        dispX = nx;
        dispY = ny;
      },
      reset() {
        dispX = x * size + half;
        dispY = y * size + half;
      },
      draw(ctx) {
        ctx.fillStyle = fill;
        ctx.fillText(char, dispX, dispY + size * 0.1);
      },
    };
}
export { Piece };