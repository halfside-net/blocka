import { scoreByBlockType } from "../../components/Block/constants";
import { PieceData } from "./types";

export function pieceScore(piece: PieceData) {
  return piece.reduce(
    (total, row) =>
      total +
      row.reduce(
        (rowTotal, block) => rowTotal + (scoreByBlockType[block] ?? 0),
        0
      ),
    0
  );
}
