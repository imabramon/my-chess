import { createContext, FC, useCallback, useReducer } from "react";
import styled from "styled-components";
import { DndProvider } from "../dnd";
import { CELL_SIZE, ROW_COUNT, COLUMN_COUNT } from "../constants";
import { FigureType } from "../types";
import { Row } from "./Row";
import { cloneDeep } from "lodash";

interface FigureInfo {
  type: FigureType;
}

type BoardData = (FigureInfo | null)[][];

const createField = () => {
  const board: BoardData = Array.from({ length: 8 }).map(() =>
    Array.from({ length: 8 }).map(() => null)
  );

  board[7][4] = {
    type: "WhiteQueen",
  };

  board[6][4] = {
    type: "WhitePawn",
  };

  return board;
};
enum BoardActions {
  set,
  delete,
}

interface BoardActionBase {
  type: BoardActions;
}

interface Coords {
  x: number;
  y: number;
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
  const [board, dispatch] = useReducer(boardReducer, createField());

  const move = (x0: number, y0: number, x1: number, y1: number) => {
    if (x0 === x1 && y0 === y1) return;
    const prevData = board[y0]?.[x0];
    console.log("calll", prevData);
    if (!prevData) return;

    dispatch(boardDelete(x0, y0));
    dispatch(boardSet(x1, y1, prevData));
  };

  return { board, move };
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
