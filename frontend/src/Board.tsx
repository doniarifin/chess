import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { BoardType } from "./types";
import { pieceIcons } from "./icons";

type Props = {
  board: BoardType;
  onMove: (fromX: number, fromY: number, toX: number, toY: number) => void;
};

function DraggablePiece({ id, children }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

function Cell({ x, y, piece }: any) {
  const { setNodeRef } = useDroppable({
    id: `${x}-${y}`,
  });

  const isWhite = (x + y) % 2 === 0;

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 70,
        height: 70,
        background: isWhite ? "#f0d9b5" : "#b58863",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {piece && (
        <DraggablePiece id={`${x}-${y}`}>
          <div style={{ fontSize: 36 }}>{pieceIcons[piece]}</div>
        </DraggablePiece>
      )}
    </div>
  );
}

export default function Board({ board, onMove }: Props) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const [fromX, fromY] = active.id.toString().split("-").map(Number);
    const [toX, toY] = over.id.toString().split("-").map(Number);

    onMove(fromX, fromY, toX, toY);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 70px)",
          border: "2px solid black",
        }}
      >
        {board.map((row, i) =>
          row.map((cell, j) => (
            <Cell key={`${i}-${j}`} x={i} y={j} piece={cell} />
          )),
        )}
      </div>
    </DndContext>
  );
}
