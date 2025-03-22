import { createContext, FC } from "react";
import styled from "styled-components";
import { DndProvider } from "../../dnd/common";
import { CELL_SIZE, ROW_COUNT, COLUMN_COUNT } from "../../constants";
import { Row } from "../Row";
import { useBoard } from "./useBoard";

export type BoardContext = ReturnType<typeof useBoard>;

export const BoardContext = createContext<Partial<BoardContext>>({});

const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: ${CELL_SIZE * ROW_COUNT}px;
  height: ${CELL_SIZE * COLUMN_COUNT}px;
`;

export interface BoardProps {
  fen?: string;
}

export const Board: FC<BoardProps> = (props) => {
  const { fen } = props;
  const boardContext = useBoard(fen);
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
