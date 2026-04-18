import { useEffect, useState } from "react";
import Board from "./Board";
import { createGame, getGame, move, aiMove } from "./api";
import type { BoardType } from "./types";

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardType>([]);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = async () => {
    const res = await createGame();
    const id = res.data.gameId;
    setGameId(id);

    const game = await getGame(id);
    setBoard(game.data.board);
  };

  const refresh = async () => {
    if (!gameId) return;
    const res = await getGame(gameId);
    setBoard(res.data.board);
  };

  const handleMove = async (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
  ) => {
    if (!gameId) return;

    await move(gameId, { fromX, fromY, toX, toY });
    await refresh();

    await aiMove(gameId, "medium");
    await refresh();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chess vs AI</h1>
      <Board board={board} onMove={handleMove} />
    </div>
  );
}

export default App;
