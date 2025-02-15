import WhiteBishop from "../assets/White_Bishop.png";
import BlackBishop from "../assets/Black_Bishop.png";
import {
  FigureInfo,
  FigureType,
  FigureColor,
  GetMoves,
  Coords,
} from "../types";

export class Bishop implements FigureInfo {
  type: FigureType = "Bishop";
  color: FigureColor = "White";

  constructor(color: FigureColor = "White") {
    this.color = color;
  }

  legalMoves: GetMoves = (current: Coords, size: Coords): string[] => {
    const moves: string[] = [];
    const { x, y } = current;

    // Все возможные направления для слона (по диагоналям)
    const directions = [
      { dx: -1, dy: -1 }, // Влево-вверх
      { dx: 1, dy: -1 }, // Вправо-вверх
      { dx: -1, dy: 1 }, // Влево-вниз
      { dx: 1, dy: 1 }, // Вправо-вниз
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
    return this.color === "White" ? WhiteBishop : BlackBishop;
  }
}
