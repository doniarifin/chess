package api

import (
	"net/http"
	"strings"

	"chess-engine/engine"
	"chess-engine/service"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	GM *service.GameManager
}

func NewHandler(gm *service.GameManager) *Handler {
	return &Handler{GM: gm}
}

func (h *Handler) CreateGame(c *gin.Context) {
	id := h.GM.CreateGame()

	c.JSON(http.StatusOK, CreateGameResponse{
		GameID: id,
	})
}

func (h *Handler) GetGame(c *gin.Context) {
	id := c.Param("id")

	game, ok := h.GM.GetGame(id)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "game not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"board": serializeBoard(game.Board),
		"turn":  game.Turn,
	})
}

func (h *Handler) Move(c *gin.Context) {
	id := c.Param("id")

	var req MoveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
		return
	}

	move := engine.Move{
		FromX: req.FromX,
		FromY: req.FromY,
		ToX:   req.ToX,
		ToY:   req.ToY,
	}

	ok, game := h.GM.Move(id, move)
	if !ok || game == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid move or game"})
		return
	}

	status := "ok"
	if engine.IsCheckmate(game, game.Turn) {
		status = "checkmate"
	} else if engine.IsCheck(game.Board, game.Turn) {
		status = "check"
	}

	c.JSON(http.StatusOK, gin.H{
		"status": status,
		"turn":   game.Turn,
		"board":  serializeBoard(game.Board),
	})
}

func serializeBoard(b engine.Board) [][]string {
	out := make([][]string, 8)

	for i := 0; i < 8; i++ {
		row := make([]string, 8)
		for j := 0; j < 8; j++ {
			p := b[i][j]
			if p == nil {
				row[j] = ""
				continue
			}

			symbol := string(p.Type[:1])
			if p.Color == engine.White {
				symbol = strings.ToUpper(symbol)
			}
			row[j] = symbol
		}
		out[i] = row
	}

	return out
}

func (h *Handler) AIMove(c *gin.Context) {
	id := c.Param("id")

	game, ok := h.GM.GetGame(id)
	if !ok {
		c.JSON(404, gin.H{"error": "game not found"})
		return
	}

	move := engine.BestMove(game.Board, game.Turn, 3)
	if move == nil {
		c.JSON(400, gin.H{"error": "no moves"})
		return
	}

	game.Move(*move)

	c.JSON(200, gin.H{
		"move":  move,
		"turn":  game.Turn,
		"board": serializeBoard(game.Board),
	})
}
