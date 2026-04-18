package engine

func GenerateMoves(b Board, turn Color) []Move {
	var moves []Move

	for i := 0; i < 8; i++ {
		for j := 0; j < 8; j++ {
			p := b[i][j]
			if p == nil || p.Color != turn {
				continue
			}

			for x := 0; x < 8; x++ {
				for y := 0; y < 8; y++ {
					m := Move{i, j, x, y}
					if IsValidMove(b, m, turn) {
						moves = append(moves, m)
					}
				}
			}
		}
	}

	return moves
}

func minimax(b Board, depth int, alpha, beta int, maximizing bool) int {
	if depth == 0 {
		return Evaluate(b)
	}

	turn := White
	if !maximizing {
		turn = Black
	}

	moves := GenerateMoves(b, turn)

	if maximizing {
		maxEval := -99999
		for _, m := range moves {
			temp := copyBoard(b)
			temp[m.ToX][m.ToY] = temp[m.FromX][m.FromY]
			temp[m.FromX][m.FromY] = nil

			eval := minimax(temp, depth-1, alpha, beta, false)

			if eval > maxEval {
				maxEval = eval
			}
			if eval > alpha {
				alpha = eval
			}
			if beta <= alpha {
				break
			}
		}
		return maxEval
	} else {
		minEval := 99999
		for _, m := range moves {
			temp := copyBoard(b)
			temp[m.ToX][m.ToY] = temp[m.FromX][m.FromY]
			temp[m.FromX][m.FromY] = nil

			eval := minimax(temp, depth-1, alpha, beta, true)

			if eval < minEval {
				minEval = eval
			}
			if eval < beta {
				beta = eval
			}
			if beta <= alpha {
				break
			}
		}
		return minEval
	}
}

func BestMove(b Board, turn Color, depth int) *Move {
	moves := GenerateMoves(b, turn)

	var bestMove *Move
	bestScore := -99999

	if turn == Black {
		bestScore = 99999
	}

	for _, m := range moves {
		temp := copyBoard(b)
		temp[m.ToX][m.ToY] = temp[m.FromX][m.FromY]
		temp[m.FromX][m.FromY] = nil

		score := minimax(temp, depth-1, -100000, 100000, turn == Black)

		if turn == White {
			if score > bestScore {
				bestScore = score
				move := m
				bestMove = &move
			}
		} else {
			if score < bestScore {
				bestScore = score
				move := m
				bestMove = &move
			}
		}
	}

	return bestMove
}
