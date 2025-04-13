import { Bishop } from "../../figures/Bishop";
import { King } from "../../figures/King";
import { Knight } from "../../figures/Knight";
import { Pawn } from "../../figures/Pawn";
import { Queen } from "../../figures/Queen";
import { Rook } from "../../figures/Rook";
import { BoardData, FigureInfo } from "../../types";

export const createField = (fen?: string): BoardData => {
  const board: BoardData = Array.from({ length: 8 }).map(() =>
    Array.from({ length: 8 }).map(() => null)
  );

  if (fen) {
    const fenParts = fen.split(" ");
    const fenBoard = fenParts[0]; // Берем только часть FEN, описывающую доску

    let row = 0;
    let col = 0;

    for (const char of fenBoard) {
      if (char === "/") {
        row++;
        col = 0;
      } else if (/\d/.test(char)) {
        col += parseInt(char, 10);
      } else {
        board[row][col] = resolveFigureByFENChar(char);
        col++;
      }
    }
  }

  return board;
};

export const resolveFigureByFENChar = (char: string): FigureInfo => {
  const color = char === char.toUpperCase() ? "White" : "Black";
  switch (char.toLocaleUpperCase()) {
    case "P":
      return new Pawn(color);
    case "R":
      return new Rook(color);
    case "N":
      return new Knight(color);
    case "B":
      return new Bishop(color);
    case "Q":
      return new Queen(color);
    case "K":
      return new King(color);
    default:
      throw new Error(`Unknown figure type: ${char}`);
  }
};

export const resolveCharByColor = (char: string, color: "White" | "Black") => {
  if (color === "White") return char.toUpperCase();
  return char.toLowerCase();
};

export const getFenString = (board: BoardData) => {
  const fenParts: string[] = [];

  board.forEach((row) => {
    const rowParts: string[] = [];
    let emptyCount = 0;
    row.forEach((cell) => {
      if (!cell) {
        emptyCount++;
        return;
      }

      if (emptyCount) {
        rowParts.push(emptyCount.toString());
        emptyCount = 0;
      }
      rowParts.push(cell.fen);
    });
    if (emptyCount) rowParts.push(emptyCount.toString());

    fenParts.push(rowParts.join(""));
  });

  return fenParts.join("/");
};
