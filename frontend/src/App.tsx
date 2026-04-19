import { useEffect, useState } from "react";
import Board from "./Board";
import { createGame, getGame, move, aiMove } from "./api";
import type { BoardType } from "./types";
import { FaChessKing, FaArrowAltCircleLeft } from "react-icons/fa";
import { useNotif } from "./helper/notif";
import NotificationModal from "./components/Notif";
// import s from "./helper/notif";

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

type Move = {
  from?: string;
  to?: string;
} | null;

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [mode, setMode] = useState<"ai" | "pvp">("pvp");
  const [started, setStarted] = useState(false);

  const [turn, setTurn] = useState<"white" | "black">("white");
  const [lastMove, setLastMove] = useState<Move>(null);

  const { notif, showNotif, closeNotif } = useNotif();

  useEffect(() => {
    if (started) startGame(mode);
  }, [mode, started]);

  const startGame = async (selectedMode = mode) => {
    setLastMove({
      from: "",
      to: "",
    });

    if (selectedMode === "pvp") {
      setGameId(null);
      setBoard(initialBoard);
      return;
    }

    const res = await createGame();
    const id = res.data.gameId;
    setGameId(id);

    const result = await getGame(id);
    setBoard(result.data.board);
    const turn = result?.data?.turn;
    // console.log(turn);
    setTurn(turn);
  };

  const startNewGame = async (selectedMode = mode) => {
    await changeMode(selectedMode);
    setStarted(true);
  };

  const refresh = async () => {
    if (!gameId) return;
    const result = await getGame(gameId);
    setBoard(result.data.board);
    const turn = result?.data?.turn;
    // console.log(turn);
    setTurn(turn);

    // if (!result.ok) return;
  };

  const handleMove = async (
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
  ) => {
    if (!gameId) return;

    try {
      const result = await move(gameId, { fromX, fromY, toX, toY });
      await refresh();

      if (mode === "ai") {
        await aiMove(gameId, "medium");
        await refresh();
      }

      if (result?.data?.status == "check") {
        showNotif("info", result?.data?.status);
        return;
      }

      return result;
    } catch (err: any) {
      return err;
    }
  };

  const handleReset = async () => {
    setMode("ai");
    refresh();
    await startGame();
  };

  const changeMode = async (newMode: "ai" | "pvp") => {
    setMode(newMode);
    // await refresh();
    await startGame();
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col items-center p-2">
      <div
        className={`w-full flex flex-col items-center transition ${
          !started ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <div className="text-center mb-2">
          <div className="flex text-center gap-2">
            <div className="self-center">
              <FaChessKing size={50} color="black" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Chess Game
            </h1>
          </div>
          <p className="text-gray-500 mt-1">
            Play vs Computer or with a friend
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 mb-6">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => changeMode("ai")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                mode === "ai"
                  ? "bg-blue-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Computer
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

          <div className="w-px h-6 bg-gray-300" />

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition shadow cursor-pointer"
          >
            Reset Game
          </button>
        </div>

        {/* Board */}
        <div className="relative flex items-center justify-center">
          {/* board */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <Board
              board={board}
              onMove={handleMove}
              lastMove={lastMove}
              setLastMove={setLastMove}
            />
          </div>

          {/* arrow */}
          <div className="absolute right-[-40px] h-[480px] flex items-center">
            <div className="relative w-6 h-full">
              <div
                className={`absolute left-0 transition-all duration-300`}
                style={{
                  top: turn === "black" ? "0%" : "100%",
                  transform: "translateY(-50%)",
                }}
              >
                <div className="text-red-500 text-2xl">
                  <FaArrowAltCircleLeft size={40} color="Dodgerblue" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* overlay */}
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <FaChessKing size={50} className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Chess Game</h1>
            <p className="text-gray-500 mb-6">Ready to play?</p>

            <button
              onClick={() => startNewGame("ai")}
              className="px-6 mt-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition cursor-pointer"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      <NotificationModal
        open={notif.open}
        type={notif.type}
        message={notif.message}
        onClose={closeNotif}
      />
    </div>
  );
}

export default App;
