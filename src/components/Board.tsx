import { useRef, useState, useCallback, createContext, FC } from "react";
import styled from "styled-components";
import { DndProvider } from "../dnd";
import { CELL_SIZE, ROW_COUNT, COLUMN_COUNT } from "../constants";
import { FigureType } from "../types";
import { Row } from "./Row";

interface FigureInfo {
  type: FigureType;
}

const createField = () => {
  const board: (FigureInfo | null)[][] = Array.from({ length: 8 }).map(() =>
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

export const useBoard = () => {
  const board = useRef(createField());

  const [, dummy] = useState("");

  const move = useCallback((x0: number, y0: number, x1: number, y1: number) => {
    dummy(`${x1}, ${y1}`);
    const data = board.current?.[y0]?.[x0];
    board.current[y1][x1] = data;
    if (board.current?.[y0]?.[x0]) board.current[y0][x0] = null;
  }, []);

  return { board: board.current, move };
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
  console.log("render");
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
