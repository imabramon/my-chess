import { FC, useMemo } from "react";
import styled from "styled-components";
import { CELL_SIZE } from "../constants";
import { Dragable } from "../dnd";
import WhiteQueen from "../assets/White_Queen.png";
import WhitePawn from "../assets/White_Pawn.png";
import { FigureType } from "../types";

const FigureImage = styled.img`
  width: ${CELL_SIZE * 0.9}px;
  height: ${CELL_SIZE * 0.9}px;
`;

interface FigureProps {
  row: number;
  column: number;
  data: any;
  onDrag: () => void;
}

const IMAGE_BY_TYPE: Record<FigureType, string> = {
  WhiteQueen: WhiteQueen,
  WhitePawn: WhitePawn,
};

export const Figure: FC<FigureProps> = ({ row, column, data, onDrag }) => {
  const figureData = useMemo(
    () => ({ row, column, figureData: data }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row, column]
  );

  return (
    <Dragable data={figureData} onDrag={onDrag}>
      <FigureImage src={IMAGE_BY_TYPE[data?.type as unknown as FigureType]} />
    </Dragable>
  );
};
