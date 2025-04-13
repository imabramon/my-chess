import { useSet } from "@uidotdev/usehooks";
import { cloneDeep } from "lodash";
import { useMemo, useReducer, useRef } from "react";
import { BOARD_SIZE } from "../../constants";
import { Coords, FigureInfo, BoardData } from "../../types";
import { createField, getFenString } from "./helpers";

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

const boardReducer = (board: BoardData, action: BoardAction): BoardData => {
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

export const useBoard = (fen?: string) => {
  const [board, dispatch] = useReducer(
    boardReducer,
    createField(fen ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
  );

  const fenString = useMemo(() => getFenString(board), [board]);

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

  return { board, fenString, move, startMove, moveCells, attackCells, moveTo };
};
