import { FigureType, GetMoves, Coords } from "../types";
import WhiteKing from "../assets/White_King.png";
import BlackKing from "../assets/Black_King.png";
import { BaseFigure } from "./Base";

export class King extends BaseFigure {
  type: FigureType = "King";
  _fen = "K";

  legalMoves: GetMoves = (current: Coords, size: Coords): string[] => {
    const moves: string[] = [];
    const { x, y } = current;

    // Все возможные направления для короля
    const directions = [
      { dx: -1, dy: -1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 1 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
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
    return this.color === "White" ? WhiteKing : BlackKing;
  }
}
