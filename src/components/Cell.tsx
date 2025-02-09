import { FC, useContext } from "react";
import styled from "styled-components";
import { CELL_SIZE } from "../constants";
import { Dropable } from "../dnd/Dropable";
import { BoardContext } from "./Board";
import { Figure } from "./Figure";
import { FigureInfo, Nullable } from "../types";

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

const CellRed = styled(BaseCell)`
  background-color: red;
  color: white;
`;

interface CellProps {
  row: number;
  column: number;
  data: Nullable<FigureInfo>;
}

const LegalPoint = styled.div`
  position: absolute;
  width: 25%;
  height: 25%;
  border-radius: 50%;
  background-color: green;
`;

const getCellComponent = (isUnderAttack: boolean, indicator: number) => {
  if (isUnderAttack) return CellRed;

  return indicator % 2 ? CellBlack : CellWhite;
};

export const Cell: FC<CellProps> = ({ row, column, data }) => {
  const boardContext = useContext(BoardContext);

  // @ts-ignore
  const move: BoardContext.move = boardContext.move;
  const movebleCells = boardContext.moveCells;
  const attackCells = boardContext.attackCells;
  const startMove = boardContext.startMove;

  const cordsId = `${column}, ${row}`;
  const canMove = !!movebleCells?.has(cordsId);

  const hasFigure = !!data;
  const isUnderAttack = !!attackCells?.has(cordsId) && hasFigure;

  const indicator = row + column;
  const CellComponent = getCellComponent(isUnderAttack, indicator);

  const showLegalPoint = canMove && !isUnderAttack;

  return (
    <Dropable
      onDrop={(e) => {
        console.log("ON DROP", row, column, e, boardContext.board);
        if (canMove || isUnderAttack) {
          move(e.data.column, e.data.row, column, row);
        }
      }}
    >
      <CellComponent>
        {hasFigure ? (
          <Figure
            row={row}
            column={column}
            data={data}
            onDrag={() => startMove?.(row, column, data)}
          />
        ) : (
          `${row}, ${column}`
        )}
        {showLegalPoint && <LegalPoint />}
      </CellComponent>
    </Dropable>
  );
};
