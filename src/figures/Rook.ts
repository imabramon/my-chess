import WhiteRook from "../assets/White_Rook.png";
import BlackRook from "../assets/Black_Rook.png";
import { Coords, FigureType, GetMoves } from "../types";
import { BaseFigure } from "./Base";

export class Rook extends BaseFigure {
  type: FigureType = "Rook";
  _fen = "R";

  legalMoves: GetMoves = (current: Coords, size: Coords): string[] => {
    const moves: string[] = [];
    const { x, y } = current;

    // Все возможные направления для ладьи (только по горизонтали и вертикали)
    const directions = [
      { dx: -1, dy: 0 }, // Влево
      { dx: 1, dy: 0 }, // Вправо
      { dx: 0, dy: -1 }, // Вверх
      { dx: 0, dy: 1 }, // Вниз
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
    return this.color === "White" ? WhiteRook : BlackRook;
  }
}
