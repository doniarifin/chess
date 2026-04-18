package engine

type Board [8][8]*Piece

func NewBoard() Board {
	var b Board

	// Pawn
	for i := 0; i < 8; i++ {
		b[1][i] = &Piece{Pawn, Black}
		b[6][i] = &Piece{Pawn, White}
	}

	// Rook
	b[0][0], b[0][7] = &Piece{Rook, Black}, &Piece{Rook, Black}
	b[7][0], b[7][7] = &Piece{Rook, White}, &Piece{Rook, White}

	// Knight
	b[0][1], b[0][6] = &Piece{Knight, Black}, &Piece{Knight, Black}
	b[7][1], b[7][6] = &Piece{Knight, White}, &Piece{Knight, White}

	// Bishop
	b[0][2], b[0][5] = &Piece{Bishop, Black}, &Piece{Bishop, Black}
	b[7][2], b[7][5] = &Piece{Bishop, White}, &Piece{Bishop, White}

	// Queen
	b[0][3] = &Piece{Queen, Black}
	b[7][3] = &Piece{Queen, White}

	// King
	b[0][4] = &Piece{King, Black}
	b[7][4] = &Piece{King, White}

	return b
}
