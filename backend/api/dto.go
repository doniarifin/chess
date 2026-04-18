package api

type CreateGameResponse struct {
	GameID string `json:"gameId"`
}

type MoveRequest struct {
	FromX int `json:"fromX"`
	FromY int `json:"fromY"`
	ToX   int `json:"toX"`
	ToY   int `json:"toY"`
}
