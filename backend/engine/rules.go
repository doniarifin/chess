package engine

func IsInside(x, y int) bool {
	return x >= 0 && x < 8 && y >= 0 && y < 8
}

func IsValidMove(b Board, m Move, turn Color) bool {
	piece := b[m.FromX][m.FromY]
	if piece == nil || piece.Color != turn {
		return false
	}

	target := b[m.ToX][m.ToY]
	if target != nil && target.Color == piece.Color {
		return false
	}

	switch piece.Type {
	case Pawn:
		return validatePawn(b, m, piece.Color)
	case Rook:
		return validateRook(b, m)
	case Knight:
		return validateKnight(b, m)
	case Bishop:
		return validateBishop(b, m)
	case Queen:
		return validateQueen(b, m)
	case King:
		return validateKing(b, m)
	}

	// simulate move
	temp := copyBoard(b)
	temp[m.ToX][m.ToY] = temp[m.FromX][m.FromY]
	temp[m.FromX][m.FromY] = nil

	kx, ky := findKing(temp, turn)

	// cek king
	enemy := White
	if turn == White {
		enemy = Black
	}

	if isSquareAttacked(temp, kx, ky, enemy) {
		return false
	}

	return false
}

func validatePawn(b Board, m Move, color Color) bool {
	dir := -1
	startRow := 6

	if color == Black {
		dir = 1
		startRow = 1
	}

	// move 1
	if m.ToY == m.FromY && m.ToX == m.FromX+dir && b[m.ToX][m.ToY] == nil {
		return true
	}

	// move 2
	if m.FromX == startRow &&
		m.ToY == m.FromY &&
		m.ToX == m.FromX+2*dir &&
		b[m.FromX+dir][m.FromY] == nil &&
		b[m.ToX][m.ToY] == nil {
		return true
	}

	// diagonal
	if abs(m.ToY-m.FromY) == 1 &&
		m.ToX == m.FromX+dir &&
		b[m.ToX][m.ToY] != nil {
		return true
	}

	return false
}

func validateRook(b Board, m Move) bool {
	if m.FromX != m.ToX && m.FromY != m.ToY {
		return false
	}

	dx := sign(m.ToX - m.FromX)
	dy := sign(m.ToY - m.FromY)

	x, y := m.FromX+dx, m.FromY+dy
	for x != m.ToX || y != m.ToY {
		if b[x][y] != nil {
			return false
		}
		x += dx
		y += dy
	}

	return true
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func sign(x int) int {
	if x > 0 {
		return 1
	}
	if x < 0 {
		return -1
	}
	return 0
}

func validateKnight(b Board, m Move) bool {
	dx := abs(m.ToX - m.FromX)
	dy := abs(m.ToY - m.FromY)

	if (dx == 2 && dy == 1) || (dx == 1 && dy == 2) {
		return true
	}
	return false
}

func validateBishop(b Board, m Move) bool {
	if abs(m.ToX-m.FromX) != abs(m.ToY-m.FromY) {
		return false
	}

	dx := sign(m.ToX - m.FromX)
	dy := sign(m.ToY - m.FromY)

	x, y := m.FromX+dx, m.FromY+dy
	for x != m.ToX && y != m.ToY {
		if b[x][y] != nil {
			return false
		}
		x += dx
		y += dy
	}

	return true
}

func validateQueen(b Board, m Move) bool {
	return validateRook(b, m) || validateBishop(b, m)
}

func validateKing(b Board, m Move) bool {
	dx := abs(m.ToX - m.FromX)
	dy := abs(m.ToY - m.FromY)

	return dx <= 1 && dy <= 1
}

func findKing(b Board, color Color) (int, int) {
	for i := 0; i < 8; i++ {
		for j := 0; j < 8; j++ {
			p := b[i][j]
			if p != nil && p.Type == King && p.Color == color {
				return i, j
			}
		}
	}
	return -1, -1
}

func isSquareAttacked(b Board, x, y int, attacker Color) bool {
	for i := 0; i < 8; i++ {
		for j := 0; j < 8; j++ {
			p := b[i][j]
			if p != nil && p.Color == attacker {
				m := Move{i, j, x, y}
				if IsValidMove(b, m, attacker) {
					return true
				}
			}
		}
	}
	return false
}

func copyBoard(b Board) Board {
	var newB Board
	for i := 0; i < 8; i++ {
		for j := 0; j < 8; j++ {
			newB[i][j] = b[i][j]
		}
	}
	return newB
}

func IsCheck(b Board, color Color) bool {
	kx, ky := findKing(b, color)

	enemy := White
	if color == White {
		enemy = Black
	}

	return isSquareAttacked(b, kx, ky, enemy)
}

func IsCheckmate(g *Game, color Color) bool {
	if !IsCheck(g.Board, color) {
		return false
	}

	for i := 0; i < 8; i++ {
		for j := 0; j < 8; j++ {
			p := g.Board[i][j]
			if p != nil && p.Color == color {
				for x := 0; x < 8; x++ {
					for y := 0; y < 8; y++ {
						m := Move{i, j, x, y}
						if IsValidMove(g.Board, m, color) {
							return false
						}
					}
				}
			}
		}
	}

	return true
}
