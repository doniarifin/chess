import { useEffect, useState } from "react";
import Board from "./Board";
import { createGame, getGame, move, aiMove } from "./api";
import type { BoardType } from "./types";
import { FaChessKing } from "react-icons/fa";

export const initialBoard: BoardType = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [mode, setMode] = useState<"ai" | "pvp">("pvp");

  useEffect(() => {
    startGame(mode);
  }, [mode]);

  const startGame = async (selectedMode = mode) => {
    if (selectedMode === "pvp") {
      setGameId(null);
      setBoard(initialBoard);
      return;
    }

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

    // ai
    if (mode === "ai") {
      await aiMove(gameId, "medium");
      await refresh();
    }
  };

  const handleReset = async () => {
    await startGame(mode);
  };

  const changeMode = async (newMode: "ai" | "pvp") => {
    setMode(newMode);
    await startGame();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-2">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="flex text-center gap-2">
          <div className="self-center">
            <FaChessKing size={50} color="black" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Chess Game</h1>
        </div>
        <p className="text-gray-500 mt-1">Play vs AI or with a friend</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 mb-6">
        {/* Mode switch */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => changeMode("ai")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              mode === "ai"
                ? "bg-blue-500 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            AI
          </button>

          <button
            onClick={() => changeMode("pvp")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              mode === "pvp"
                ? "bg-blue-500 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            2 Player
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Reset */}
        <button
          onClick={handleReset}
          className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition shadow"
        >
          Reset Game
        </button>
      </div>

      {/* Board Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <Board board={board} onMove={handleMove} />
      </div>
    </div>
  );
}

export default App;
