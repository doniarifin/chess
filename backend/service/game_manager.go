package service

import (
	"sync"

	"chess-engine/engine"

	"github.com/google/uuid"
)

type GameManager struct {
	mu    sync.RWMutex
	games map[string]*engine.Game
}

func NewGameManager() *GameManager {
	return &GameManager{
		games: make(map[string]*engine.Game),
	}
}

func (gm *GameManager) CreateGame() string {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	id := uuid.NewString()
	gm.games[id] = engine.NewGame()
	return id
}

func (gm *GameManager) GetGame(id string) (*engine.Game, bool) {
	gm.mu.RLock()
	defer gm.mu.RUnlock()

	g, ok := gm.games[id]
	return g, ok
}

func (gm *GameManager) Move(id string, m engine.Move) (bool, *engine.Game) {
	gm.mu.Lock()
	defer gm.mu.Unlock()

	g, ok := gm.games[id]
	if !ok {
		return false, nil
	}

	ok = g.Move(m)
	return ok, g
}
