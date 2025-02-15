import { createContext, FC, useReducer, useRef } from "react";
import styled from "styled-components";
import { DndProvider } from "../dnd/common";
import { CELL_SIZE, ROW_COUNT, COLUMN_COUNT, BOARD_SIZE } from "../constants";
import { BoardData, Coords, FigureInfo } from "../types";
import { Row } from "./Row";
import { cloneDeep } from "lodash";
import { useSet } from "@uidotdev/usehooks";
import { Queen } from "../figures/Queen";
import { Pawn } from "../figures/Pawn";
import { Rook } from "../figures/Rook";
import { King } from "../figures/King";
import { Knight } from "../figures/Knight";
import { Bishop } from "../figures/Bishop";

const createField = (fen?: string): BoardData => {
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

const resolveFigureByFENChar = (char: string): FigureInfo => {
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

enum BoardActions {
  set,
  delete,
}

interface BoardActionBase {
  type: BoardActions;
}

interface SetAction extends BoardActionBase {
  type: BoardActions.set;
  position: Coords;
  data: FigureInfo;
}

interface DeleteAction extends BoardActionBase {
  type: BoardActions.delete;
  position: Coords;
}

type BoardAction = SetAction | DeleteAction;

const boardReducer = (board: BoardData, action: BoardAction) => {
  switch (action.type) {
    case BoardActions.set: {
      const newBoard = cloneDeep(board);
      const { x, y } = action.position;
      newBoard[y][x] = action.data;
      return newBoard;
    }
    case BoardActions.delete: {
      const newBoard = cloneDeep(board);
      const { x, y } = action.position;
      newBoard[y][x] = null;
      return newBoard;
    }
    default: {
      console.error("Undefined board action");
      return board;
    }
  }
};

const boardSet = (x: number, y: number, data: FigureInfo): SetAction => ({
  type: BoardActions.set,
  position: { x, y },
  data,
});

const boardDelete = (x: number, y: number): DeleteAction => ({
  type: BoardActions.delete,
  position: { x, y },
});

export const useBoard = () => {
  const [board, dispatch] = useReducer(
    boardReducer,
    createField("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
  );
  const moveCells = useSet<string>([]);
  const attackCells = useSet<string>([]);
  const currentFigurePosition = useRef<Coords | null>();

  const move = (x0: number, y0: number, x1: number, y1: number) => {
    if (x0 === x1 && y0 === y1) return;
    const prevData = board[y0]?.[x0];
    console.log("calll", prevData, x0, y0);
    if (!prevData) return;

    dispatch(boardDelete(x0, y0));
    dispatch(boardSet(x1, y1, prevData));
    moveCells.clear();
    attackCells.clear();
  };

  const moveTo = (x: number, y: number) => {
    console.log("calll moveTo", currentFigurePosition.current, x, y);
    const position = currentFigurePosition.current;
    if (!position) return null;
    move(position.x, position.y, x, y);
  };

  const hightlightCells = (x: number, y: number, data: FigureInfo) => {
    const legal = data.legalMoves({ x, y }, BOARD_SIZE);
    const thisCellId = `${x}, ${y}`;

    moveCells.clear();
    legal.forEach((cell) => {
      moveCells.add(cell);
      attackCells.add(cell);
    });

    moveCells.delete(thisCellId);
    attackCells.delete(thisCellId);
  };

  const pickFigure = (x: number, y: number) => {
    console.log("calll pick", x, y);
    currentFigurePosition.current = { x, y };
  };

  const startMove = (x: number, y: number, data: FigureInfo) => {
    hightlightCells(x, y, data);
    pickFigure(x, y);
  };

  return { board, move, startMove, moveCells, attackCells, moveTo };
};

export type BoardContext = ReturnType<typeof useBoard>;

export const BoardContext = createContext<Partial<BoardContext>>({});

const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: ${CELL_SIZE * ROW_COUNT}px;
  height: ${CELL_SIZE * COLUMN_COUNT}px;
`;

export const Board: FC = () => {
  const boardContext = useBoard();
  const { board } = boardContext;
  console.log("render", board);
  return (
    <BoardContext.Provider value={boardContext}>
      <DndProvider>
        <Field>
          {board.map((rowData, row) => (
            <Row row={row} data={rowData} />
          ))}
        </Field>
      </DndProvider>
    </BoardContext.Provider>
  );
};
