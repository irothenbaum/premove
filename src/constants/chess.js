export const PIECE_PAWN = 'pawn'
export const PIECE_KNIGHT = 'knight'
export const PIECE_BISHOP = 'bishop'
export const PIECE_ROOK = 'rook'
export const PIECE_QUEEN = 'queen'
export const PIECE_KING = 'king'

export const PIECE_SQUARE_HIGHLIGHT = 'highlight'

export const BOARD_SIZE = 8

const allowedKnightMoves = [-2, -1, 1, 2]
const knightMoveTuples = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
]

/**
 * @param {Piece} p
 * @param {number} boardSize
 * @returns {Array<Square>}
 */
export function getHighlightSquaresForPiece(p, boardSize) {
  switch (p.type) {
    case PIECE_KNIGHT:
      return knightMoveTuples
        .map(([row, column]) => ({
          id: `${p.id}-move-${row}-${column}`,
          row: p.row + row,
          column: p.column + column,
        }))
        .filter(({row, column}) => {
          return (
            row >= 0 && row < boardSize && column >= 0 && column < boardSize
          )
        })
  }
}

/**
 * @param {Piece} p
 * @param {Square} s
 */
export function validatePieceMove(p, s) {
  switch (p.type) {
    case PIECE_KNIGHT:
      return (
        !isSameSquare(p, s) &&
        allowedKnightMoves.includes(Math.abs(p.row - s.row)) &&
        allowedKnightMoves.includes(Math.abs(p.column - s.column)) &&
        Math.abs(p.row - s.row) !== Math.abs(p.column - s.column)
      )
  }
}

/**
 * @param {Square} s1
 * @param {Square} s2
 * @return {boolean}
 */
export function isSameSquare(s1, s2) {
  return s1.row === s2.row && s1.column === s2.column
}
