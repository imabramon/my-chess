import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  PIECE: "piece",
};

interface PieceProps {
  id: string;
  position: [number, number];
  movePiece: (id: string, newPosition: [number, number]) => void;
}

const Piece: React.FC<PieceProps> = ({ id, position, movePiece }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { id, position },
    collect: (monitor) => {
      console.log("calll collect", monitor.isDragging());
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
  }));

  return (
    <div
      ref={drag}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isDragging ? 0.5 : 1,
        fontSize: 30,
        cursor: "grab",
      }}
    >
      ♟
    </div>
  );
};

interface SquareProps {
  x: number;
  y: number;
  children?: React.ReactNode;
  movePiece: (id: string, newPosition: [number, number]) => void;
}

const Square: React.FC<SquareProps> = ({ x, y, children, movePiece }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item: { id: string }) => movePiece(item.id, [x, y]),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const black = (x + y) % 2 === 1;
  return (
    <div
      ref={drop}
      style={{
        width: 60,
        height: 60,
        backgroundColor: black ? "#769656" : "#eeeed2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        border: isOver ? "2px solid yellow" : "none",
      }}
    >
      {children}
    </div>
  );
};

const Board: React.FC = () => {
  const [pieces, setPieces] = React.useState<{
    [key: string]: [number, number];
  }>({ a2: [0, 6] });

  const movePiece = (id: string, newPosition: [number, number]) => {
    setPieces((prev) => ({
      ...prev,
      [id]: newPosition,
    }));
  };

  const renderSquare = (x: number, y: number) => {
    const pieceKey = Object.keys(pieces).find(
      (key) => pieces[key][0] === x && pieces[key][1] === y
    );
    return (
      <Square key={`${x}-${y}`} x={x} y={y} movePiece={movePiece}>
        {pieceKey && (
          <Piece id={pieceKey} position={[x, y]} movePiece={movePiece} />
        )}
      </Square>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 60px)",
        gridTemplateRows: "repeat(8, 60px)",
        width: 480,
        height: 480,
        border: "2px solid black",
      }}
    >
      {Array.from({ length: 8 }, (_, y) =>
        Array.from({ length: 8 }, (_, x) => renderSquare(x, y))
      )}
    </div>
  );
};

const Demo: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Board />
    </DndProvider>
  );
};

export default Demo;
