import { resolveCharByColor } from "../components/Board/helpers";
import { FigureColor, FigureInfo, FigureType, GetMoves } from "../types";

export abstract class BaseFigure implements FigureInfo {
  abstract type: FigureType;
  color: FigureColor;
  abstract legalMoves: GetMoves;
  abstract legalAttacks: GetMoves;
  abstract _fen: string;

  abstract get image(): string;

  constructor(color: FigureColor = "White") {
    this.color = color;
  }

  get fen() {
    return resolveCharByColor(this._fen, this.color);
  }
}
