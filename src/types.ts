// abstract

export interface Coords {
  x: number;
  y: number;
}

export type Nullable<T> = T | undefined | null;

// figure

export type GetMoves = (current: Coords, size: Coords) => string[];

export interface FigureInfo {
  type: FigureType;
  color: FigureColor;
  legalMoves: GetMoves;
  legalAttacks: GetMoves;
  get image(): string;
}

export type FigureType =
  | "Queen"
  | "Pawn"
  | "Rook"
  | "Bishop"
  | "Knight"
  | "King";
export type FigureColor = "White" | "Black";

// board

export type BoardData = (FigureInfo | null)[][];
