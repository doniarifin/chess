package engine

type Game struct {
	Board Board
	Turn  Color
}

func NewGame() *Game {
	return &Game{
		Board: NewBoard(),
		Turn:  White,
	}
}

func (g *Game) Move(m Move) bool {
	if !IsValidMove(g.Board, m, g.Turn) {
		return false
	}

	g.Board[m.ToX][m.ToY] = g.Board[m.FromX][m.FromY]
	g.Board[m.FromX][m.FromY] = nil

	// switch turn
	if g.Turn == White {
		g.Turn = Black
	} else {
		g.Turn = White
	}

	return true
}
