import { FC, useMemo } from "react";
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
  onDrag: () => void;
}

export const Figure: FC<FigureProps> = ({ row, column, data, onDrag }) => {
  const figureData = useMemo(
    () => ({ row, column, figureData: data }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row, column]
  );

  return (
    <Dragable data={figureData} onDrag={onDrag}>
      <FigureImage src={data.image} onClick={(e) => {}} />
    </Dragable>
  );
};
