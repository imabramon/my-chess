import { FC, useContext } from "react";
import styled from "styled-components";
import { CELL_SIZE } from "../constants";
import { Dropable } from "../dnd";
import { BoardContext } from "./Board";
import { Figure } from "./Figure";

const BaseCell = styled.div`
  min-width: ${CELL_SIZE}px;
  width: ${CELL_SIZE}px;
  min-height: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
`;

const CellWhite = styled(BaseCell)`
  background-color: white;
  color: black;
`;

const CellBlack = styled(BaseCell)`
  background-color: black;
  color: white;
`;

interface CellProps {
  row: number;
  column: number;
  data: any;
}

const LegalPoint = styled.div`
  position: absolute;
  width: 25%;
  height: 25%;
  border-radius: 50%;
  background-color: green;
`;

export const Cell: FC<CellProps> = ({ row, column, data }) => {
  const boardContext = useContext(BoardContext);

  // @ts-ignore
  const move: BoardContext.move = boardContext.move;
  const highlightedCells = boardContext.highlightedCells;
  const startMove = boardContext.startMove;

  const isLegal = highlightedCells?.has(`${column}, ${row}`);

  const indicator = row + column;
  const CellComponent = indicator % 2 ? CellBlack : CellWhite;

  return (
    <Dropable
      onDrop={(e) => {
        console.log("ON DROP", row, column, e, boardContext.board);
        move(e.data.column, e.data.row, column, row);
      }}
    >
      <CellComponent>
        {!!data ? (
          <Figure
            row={row}
            column={column}
            data={data}
            onDrag={() => startMove?.(row, column, data)}
          />
        ) : (
          `${row}, ${column}`
        )}
        {!!isLegal && <LegalPoint />}
      </CellComponent>
    </Dropable>
  );
};
