import type { JSX } from "react";
import {
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessBishop,
  FaChessQueen,
  FaChessKing,
} from "react-icons/fa";

export const pieceIcons: Record<string, JSX.Element> = {
  P: <FaChessPawn color="white" />,
  R: <FaChessRook color="white" />,
  N: <FaChessKnight color="white" />,
  B: <FaChessBishop color="white" />,
  Q: <FaChessQueen color="white" />,
  K: <FaChessKing color="white" />,

  p: <FaChessPawn color="black" />,
  r: <FaChessRook color="black" />,
  n: <FaChessKnight color="black" />,
  b: <FaChessBishop color="black" />,
  q: <FaChessQueen color="black" />,
  k: <FaChessKing color="black" />,
};
