import Square from "./Square.js";

const files = ["A", "B", "C", "D", "E", "F", "G", "H",];

export default class Board {
    constructor({selector, size}) {
        this.size = size;
        this.cells = [];
        this.element = document.querySelector(selector);
        this.element.classList.add("board");
        
        this.init();
    }
    init() {
        if (this.size) {
            this.element.style.width = this.dimensions.size;
            this.element.style.height = this.dimensions.size;
        } else {
            const size = "90vmin";
            this.element.style.width = size;
            this.element.style.height = size;
        }
        this.cells = Array.from({length: 64}, (_, index) => {
            const row = 8 - Math.floor(index / 8);
            const fileNum = index % 8;
            const file = files[fileNum];
            const isBlack = !(row % 2 === fileNum % 2);
            const isWhite = (row % 2 === fileNum % 2);
            const cell = new Square({
                row, 
                file,
                isBlack,
                isWhite,
            });
            this.element.appendChild(cell.element);
            return cell;
        });
    }
}
