/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import WhiteQueen from "./assets/White_Queen.png";
import WhitePawn from "./assets/White_Pawn.png";
import { DndProvider, Dragable, Dropable } from "./dnd";

const ROW_COUNT = 8;
const COLUMN_COUNT = 8;
const CELL_SIZE = 75;

function App() {
  return <Board />;
}

type FigureType = "WhiteQueen" | "WhitePawn";

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

const BoardContext = createContext<any>({});

const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: ${CELL_SIZE * ROW_COUNT}px;
  height: ${CELL_SIZE * COLUMN_COUNT}px;
`;

export const Board: FC = () => {
  const { board, move } = useBoard();
  console.log("render");
  return (
    <BoardContext.Provider value={move}>
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

const BaseRow = styled.div`
  display: flex;
`;

interface RowProps {
  row: number;
  data: any[];
}

const Row: FC<RowProps> = ({ row, data }) => {
  return (
    <BaseRow>
      {data.map((cellData, column) => (
        <Cell row={row} column={column} data={cellData} />
      ))}
    </BaseRow>
  );
};

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

const Cell: FC<CellProps> = ({ row, column, data }) => {
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

const FigureImage = styled.img`
  width: ${CELL_SIZE * 0.9}px;
  height: ${CELL_SIZE * 0.9}px;
`;

interface FigureProps {
  row: number;
  column: number;
  data: any;
}

const IMAGE_BY_TYPE: Record<FigureType, string> = {
  WhiteQueen: WhiteQueen,
  WhitePawn: WhitePawn,
};

const Figure: FC<FigureProps> = ({ row, column, data }) => {
  const figureData = useMemo(
    () => ({ row, column, figureData: data }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row, column]
  );

  return (
    <Dragable data={figureData}>
      <FigureImage src={IMAGE_BY_TYPE[data?.type as unknown as FigureType]} />
    </Dragable>
  );
};

export default App;
