import { FC } from "react";
import styled from "styled-components";
import { Cell } from "./Cell";

const BaseRow = styled.div`
  display: flex;
`;

interface RowProps {
  row: number;
  data: any[];
}

export const Row: FC<RowProps> = ({ row, data }) => {
  return (
    <BaseRow>
      {data.map((cellData, column) => (
        <Cell row={row} column={column} data={cellData} />
      ))}
    </BaseRow>
  );
};
