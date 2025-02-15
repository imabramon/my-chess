import { FigureInfo, FigureType, FigureColor, Coords } from "../types";
import WhiteQueen from "../assets/White_Queen.png";
import BlackQueen from "../assets/Black_Queen.png";

export class Queen implements FigureInfo {
  type: FigureType = "Queen";
  color: FigureColor = "White";

  constructor(color: FigureColor) {
    this.color = color;
  }

  // Rewrite ChatGPT crap
  private _legalMoves(current: Coords, boardSize: Coords): string[] {
    const moves: string[] = [];

    // Absolute Cinema
    const { x: currentX, y: currentY } = current;
    const { x: boardWidth, y: boardHeight } = boardSize;

    function isWithinBoard(x: number, y: number): boolean {
      return x >= 0 && x < boardWidth && y >= 0 && y < boardHeight;
    }

    function addMove(x: number, y: number): void {
      if (isWithinBoard(x, y)) {
        moves.push(`${x}, ${y}`);
      }
    }

    for (let i = 0; i < boardWidth; i++) {
      if (i !== currentX) addMove(i, currentY);
    }
    for (let j = 0; j < boardHeight; j++) {
      if (j !== currentY) addMove(currentX, j);
    }

    for (let i = 1; i < Math.max(boardWidth, boardHeight); i++) {
      addMove(currentX + i, currentY + i);
      addMove(currentX - i, currentY + i);
      addMove(currentX + i, currentY - i);
      addMove(currentX - i, currentY - i);
    }

    return moves;
  }

  legalMoves(current: Coords, size: Coords) {
    return this._legalMoves(current, size);
  }

  legalAttacks(current: Coords, size: Coords) {
    return this._legalMoves(current, size);
  }

  get image() {
    if (this.color === "White") return WhiteQueen;
    if (this.color === "Black") return BlackQueen;

    return "undefined";
  }
}
