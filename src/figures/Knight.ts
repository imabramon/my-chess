import WhiteKnight from "../assets/White_Knight.png";
import BlackKnight from "../assets/Black_Knight.png";
import {
  FigureInfo,
  FigureType,
  FigureColor,
  GetMoves,
  Coords,
} from "../types";

export class Knight implements FigureInfo {
  type: FigureType = "Knight";
  color: FigureColor = "White";

  constructor(color: FigureColor = "White") {
    this.color = color;
  }

  legalMoves: GetMoves = (current: Coords, size: Coords): string[] => {
    const moves: string[] = [];
    const { x, y } = current;

    // Все возможные ходы коня (буквой "Г")
    const directions = [
      { dx: -2, dy: -1 },
      { dx: -1, dy: -2 },
      { dx: 1, dy: -2 },
      { dx: 2, dy: -1 },
      { dx: 2, dy: 1 },
      { dx: 1, dy: 2 },
      { dx: -1, dy: 2 },
      { dx: -2, dy: 1 },
    ];

    // Проверяем каждое направление
    for (const dir of directions) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;

      // Если новые координаты находятся в пределах доски, добавляем их в возможные ходы
      if (newX >= 0 && newX < size.x && newY >= 0 && newY < size.y) {
        moves.push(`${newX}, ${newY}`);
      }
    }

    return moves;
  };

  legalAttacks: GetMoves = (current: Coords, size: Coords): string[] => {
    // Атака совпадает с возможными ходами
    return this.legalMoves(current, size);
  };

  get image(): string {
    return this.color === "White" ? WhiteKnight : BlackKnight;
  }
}
