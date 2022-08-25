export default class Cell {
    constructor({row, file, isBlack, isWhite}) {
        this.row = row;
        this.file = file;
        this.element = document.createElement("div");
        this.element.classList.add("square");
        if(isBlack) {
            this.element.classList.add("black");
        } else if (isWhite) {
            this.element.classList.add("white");
        }
        this.element.setAttribute("data-row", row);
        this.element.setAttribute("data-file", file);
    }
}