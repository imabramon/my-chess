import { useSet } from "@uidotdev/usehooks";
import { cloneDeep } from "lodash";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { BOARD_SIZE } from "../../constants";
import { Coords, FigureInfo, BoardData } from "../../types";
import { createField, getFenString } from "./helpers";
import { Chess, Square } from "chess.js";

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

const useLazy = <T>(init: () => T) => {
  const ref = useRef<T | null>();

  if (!ref.current) {
    ref.current = init();
  }

  return ref.current;
};

const getCoord = (x: number, y: number): string => {
  const file = String.fromCharCode("a".charCodeAt(0) + x);
  const rank = 8 - y;

  return `${file}${rank}`;
};

const fromCoord = (coord: string): string => {
  if (!/^[a-h][1-8]$/.test(coord)) {
    throw new Error("Неверная шахматная нотация");
  }

  const file = coord[0];
  const rank = parseInt(coord[1]);

  const x = file.charCodeAt(0) - "a".charCodeAt(0);
  const y = 8 - rank;

  return `${x}, ${y}`;
};

const getMoves = (engine: Chess, x: number, y: number): string[] => {
  const square = getCoord(x, y) as Square;
  const moves = engine.moves({
    square,
    verbose: true,
  });

  return moves.map((move) => fromCoord(move.to));
};

export const useBoard = (fen?: string) => {
  const [board, dispatch] = useReducer(
    boardReducer,
    createField(fen ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
  );

  const engine = useLazy(() => {
    return new Chess(fen);
  });

  const fenString = useMemo(() => getFenString(board), [board]);

  const moveCells = useSet<string>([]);
  const currentFigurePosition = useRef<Coords | null>();

  const move = (x0: number, y0: number, x1: number, y1: number) => {
    if (x0 === x1 && y0 === y1) return;
    const prevData = board[y0]?.[x0];

    if (!prevData) return;

    dispatch(boardDelete(x0, y0));
    dispatch(boardSet(x1, y1, prevData));
    engine.move({ from: getCoord(x0, y0), to: getCoord(x1, y1) });
    moveCells.clear();
  };

  const moveTo = (x: number, y: number) => {
    // console.log("calll moveTo", currentFigurePosition.current, x, y);
    const position = currentFigurePosition.current;
    if (!position) return null;
    move(position.x, position.y, x, y);
  };

  const hightlightCells = (x: number, y: number) => {
    const legal = getMoves(engine, x, y);

    const thisCellId = `${x}, ${y}`;

    moveCells.clear();
    legal.forEach((move) => {
      moveCells.add(move);
    });

    moveCells.delete(thisCellId);
  };

  const pickFigure = (x: number, y: number) => {
    currentFigurePosition.current = { x, y };
  };

  const startMove = (x: number, y: number) => {
    hightlightCells(x, y);
    pickFigure(x, y);
  };

  return { board, fenString, move, startMove, moveCells, moveTo };
};
