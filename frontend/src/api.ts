import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const createGame = () => axios.post(`${API}/game`);

export const getGame = (id: string) => axios.get(`${API}/game/${id}`);

export const move = (
  id: string,
  data: { fromX: number; fromY: number; toX: number; toY: number },
) => axios.post(`${API}/game/${id}/move`, data);

export const aiMove = (id: string, level = "medium") =>
  axios.post(`${API}/game/${id}/ai-move?level=${level}`);
