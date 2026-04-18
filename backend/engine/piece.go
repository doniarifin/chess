package engine

type PieceType string
type Color string

const (
	Pawn   PieceType = "pawn"
	Rook   PieceType = "rook"
	Knight PieceType = "night"
	Bishop PieceType = "bishop"
	Queen  PieceType = "queen"
	King   PieceType = "king"

	White Color = "white"
	Black Color = "black"
)

type Piece struct {
	Type  PieceType
	Color Color
}
