import { FC, MouseEventHandler, useMemo } from "react";
import styled from "styled-components";
import { CELL_SIZE } from "../constants";
import { FigureInfo } from "../types";
import { Dragable } from "../dnd/Dragable";

const FigureImage = styled.img`
  width: ${CELL_SIZE * 0.9}px;
  height: ${CELL_SIZE * 0.9}px;
`;

interface FigureProps {
  row: number;
  column: number;
  data: FigureInfo;
  onDrag?: () => void;
  onClick?: MouseEventHandler;
}

export const Figure: FC<FigureProps> = ({
  row,
  column,
  data,
  onDrag,
  onClick,
}) => {
  const figureData = useMemo(
    () => ({ row, column, figureData: data }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row, column]
  );

  return (
    <Dragable data={figureData} onDrag={onDrag} onClick={onClick}>
      <FigureImage src={data.image} />
    </Dragable>
  );
};
