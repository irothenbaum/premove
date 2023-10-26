import React, {useEffect, useState} from 'react'
import './PremoveLevel.scss'
import ChessBoard from '../elements/ChessBoard'
import ChessPiece from '../elements/ChessPiece'
import PropTypes from 'prop-types'
import {v4 as uuid} from 'uuid'
import {constructClassString, randomGenerator} from '../../utilities'
import {
  BOARD_SIZE,
  getHighlightSquaresForPiece,
  validatePieceMove,
  PIECE_KNIGHT,
  PIECE_PAWN,
  PIECE_SQUARE_HIGHLIGHT,
  isSameSquare,
} from '../../constants/chess'
import HighlightSquare from '../elements/HighlightSquare'

function PremoveLevel(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [pieces, setPieces] = useState([])
  /** @type {Array<Square>} */
  const [moves, setMoves] = useState([])
  const [showHighlights, setShowHighlights] = useState(false)

  useEffect(() => {
    setMoves([])
    setIsLoading(true)
    getBoardPiecesFromLevelAndSeed(props.level, props.seed, BOARD_SIZE)
      .then(p => {
        setPieces(p)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [props.seed, props.level])

  // find the player piece
  const playerPiece = pieces.find(p => p.isMovable)

  // find latest move the player piece made (if any)
  let playerPieceLatestMovePosition = playerPiece
  if (playerPiece && moves.length > 0) {
    playerPieceLatestMovePosition = {
      ...moves[moves.length - 1],
      type: playerPiece.type,
    }
  }

  /**
   * @param {Square} square
   * @param {Piece?} piece
   */
  const handleClickSquare = (square, piece) => {
    if (
      playerPiece &&
      validatePieceMove(playerPieceLatestMovePosition, square)
    ) {
      setMoves(m =>
        m.concat({...square, id: `move-${m.length}-${m.row}-${m.column}`}),
      )
    } else {
      // do nothing
    }
  }

  /**
   * @param {Square} s
   */
  const handleHoverSquare = s => {
    setShowHighlights(isSameSquare(s, playerPieceLatestMovePosition))
  }

  // we render not only the pieces, but also the moves the player has made and the squares that the player can move to
  const piecesToRender = pieces
    .concat(
      // moves they made
      moves.map((m, i) => ({
        ...m,
        type: PIECE_SQUARE_HIGHLIGHT,
        label: `${i + 1}`,
        isBlack: true,
      })),
    )
    .concat(
      // squares they can move to
      showHighlights && playerPieceLatestMovePosition
        ? getHighlightSquaresForPiece(
            playerPieceLatestMovePosition,
            BOARD_SIZE,
          ).map(p => ({
            ...p,
            type: PIECE_SQUARE_HIGHLIGHT,
          }))
        : [],
    )

  return (
    <ChessBoard
      dimension={BOARD_SIZE}
      pieces={piecesToRender}
      renderPiece={p => {
        if (p.type === PIECE_SQUARE_HIGHLIGHT) {
          return <HighlightSquare isBlack={p.isBlack} label={p.label} />
        } else {
          return (
            <ChessPiece
              type={p.type}
              isBlack={p.isBlack}
              moveCount={p.moveCount}
            />
          )
        }
      }}
      onClickSquare={handleClickSquare}
      onPlacePiece={handleClickSquare}
      onHoverSquare={handleHoverSquare}
    />
  )
}

PremoveLevel.propTypes = {
  level: PropTypes.number,
  seed: PropTypes.string,
  onWin: PropTypes.func,
  onLose: PropTypes.func,
}

export default PremoveLevel

// --------------------------------------------------------------------------------
// HELPER FUNCTIONS

const PLAYER_ID = uuid()

/**
 * @param {number} level
 * @param {string} seed
 * @param {number} boardSize
 * @returns {Promise<Array<Piece>>}
 */
export async function getBoardPiecesFromLevelAndSeed(level, seed, boardSize) {
  const rand = await randomGenerator(`${seed}-${level}`)
  const retVal = []

  const numPawns = Math.max(1, Math.ceil(Math.log(level)))

  for (let i = 0; i < numPawns; i++) {
    let nextPiece
    do {
      nextPiece = {
        id: uuid(),
        type: PIECE_PAWN,
        row: rand.next().value % (boardSize - 3),
        column: rand.next().value % boardSize,
        isBlack: true,
      }
    } while (
      retVal.some(p => p.row === nextPiece.row && p.column === nextPiece.column)
    )

    retVal.push(nextPiece)
  }

  retVal.push({
    id: PLAYER_ID,
    type: PIECE_KNIGHT,
    row: 7,
    column: rand.next().value % 2 === 0 ? 1 : 6,
    isMovable: true,
  })

  return retVal
}
