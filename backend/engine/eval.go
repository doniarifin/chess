package engine

func pieceValue(t PieceType) int {
	switch t {
	case Pawn:
		return 10
	case Knight, Bishop:
		return 30
	case Rook:
		return 50
	case Queen:
		return 90
	case King:
		return 900
	}
	return 0
}

func Evaluate(b Board) int {
	movesWhite := GenerateMoves(b, White)
	movesBlack := GenerateMoves(b, Black)

	if len(movesWhite) == 0 {
		if IsCheck(b, White) {
			return -100000
		}
		return 0
	}

	if len(movesBlack) == 0 {
		if IsCheck(b, Black) {
			return 100000
		}
		return 0
	}

	score := 0

	for i := 0; i < 8; i++ {
		for j := 0; j < 8; j++ {
			p := b[i][j]
			if p == nil {
				continue
			}

			val := pieceValue(p.Type)
			if p.Color == White {
				score += val
			} else {
				score -= val
			}
		}
	}

	return score
}
