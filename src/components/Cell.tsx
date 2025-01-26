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

export const Cell: FC<CellProps> = ({ row, column, data }) => {
  const move = useContext(BoardContext);

  const indicator = row + column;
  const CellComponent = indicator % 2 ? CellBlack : CellWhite;

  return (
    <Dropable
      onDrop={(e) => {
        console.log("ON DROP", row, column, e);
        move(e.data.column, e.data.row, column, row);
      }}
    >
      <CellComponent>
        {!!data ? (
          <Figure row={row} column={column} data={data} />
        ) : (
          `${row}, ${column}`
        )}
      </CellComponent>
    </Dropable>
  );
};
