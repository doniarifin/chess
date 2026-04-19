import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DragOverlay } from "@dnd-kit/core";
import type { BoardType } from "./types";
import { pieceIcons } from "./icons";
import { useState } from "react";
import NotificationModal from "./components/Notif";
import type { AxiosResponse } from "axios";
import { useNotif } from "./helper/notif";

type Props = {
  board: BoardType;
  onMove: (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
  ) => Promise<AxiosResponse>;
  lastMove: {
    from?: string;
    to?: string;
  } | null;
  setLastMove: React.Dispatch<
    React.SetStateAction<{
      from?: string;
      to?: string;
    } | null>
  >;
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

function Cell({ x, y, piece, lastMove }: any) {
  const { setNodeRef } = useDroppable({
    id: `${x}-${y}`,
  });

  const isWhite = (x + y) % 2 === 0;
  const id = `${x}-${y}`;

  // console.log(lastMove);
  let isFrom = false;
  let isTo = false;
  isFrom = lastMove?.from === id;
  isTo = lastMove?.to === id;

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 70,
        height: 70,
        background: isFrom
          ? "rgba(255, 38, 0, 0.31)" // from
          : isTo
            ? "rgba(0, 255, 0, 0.35)" // to
            : isWhite
              ? "#f0d9b5"
              : "#b58863",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 200ms ease",
        boxShadow: "inset 0 0 0 4px rgba(255,255,0,0.3)",
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

export default function Board({ board, onMove, lastMove, setLastMove }: Props) {
  const [activePiece, setActivePiece] = useState<any>(null);
  const { notif, showNotif, closeNotif } = useNotif();

  const handleDragStart = async (event: DragStartEvent) => {
    const [x, y] = event.active.id.toString().split("-").map(Number);
    setActivePiece(board[x][y]);
    setLastMove({
      from: `${x}-${y}`,
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActivePiece(null);

    const { active, over } = event;
    if (!over) return;

    const [fromX, fromY] = active.id.toString().split("-").map(Number);
    const [toX, toY] = over.id.toString().split("-").map(Number);

    setLastMove({
      to: `${toX}-${toY}`,
    });

    const result = await onMove(fromX, fromY, toX, toY);
    // console.log(result);

    if (result?.data?.status !== "ok") {
      showNotif("error", "Not Allowed");
      setLastMove({
        to: "",
      });
      return;
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 70px)",
          border: "2px solid black",
        }}
      >
        {board.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              x={i}
              y={j}
              piece={cell}
              lastMove={lastMove}
            />
          )),
        )}
      </div>
      <DragOverlay>
        {activePiece ? (
          <div style={{ fontSize: 36 }}>{pieceIcons[activePiece]}</div>
        ) : null}
      </DragOverlay>
      <NotificationModal
        open={notif.open}
        type={notif.type}
        message={notif.message}
        onClose={closeNotif}
      />
    </DndContext>
  );
}
