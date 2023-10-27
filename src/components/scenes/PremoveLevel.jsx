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
  PIECE_QUEEN,
} from '../../constants/chess'
import HighlightSquare from '../elements/HighlightSquare'
import PremoveControls from '../elements/PremoveControls'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'

const MOVE_TIMER = 'timer'
const MOVE_DELAY = 1000

const OPPONENT_MOVE_TIMER = 'opponent-timer'
const OPPONENT_MOVE_DELAY = MOVE_DELAY / 2

function PremoveLevel(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [pieces, setPieces] = useState([])
  /** @type {Array<Square>} */
  const [moves, setMoves] = useState(props.initializeMoves || [])
  const [hoveringPiece, setHoveringPiece] = useState(null)
  const [isShowingMoves, setIsShowingMoves] = useState(false)
  const [revealingMoveIndex, setRevealingMoveIndex] = useState(null)
  const {setTimer, cancelTimer, cancelAllTimers} = useDoOnceTimer()

  const resetBoard = () => {
    cancelAllTimers()
    setIsShowingMoves(false)
    setRevealingMoveIndex(null)
    setMoves(props.initializeMoves || [])
    setIsLoading(true)
    getBoardPiecesFromLevelAndSeed(props.level, props.seed, BOARD_SIZE)
      .then(p => {
        setPieces(p)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    resetBoard()
  }, [props.seed, props.level])

  // find the player piece
  const playerPiece = pieces.find(p => p.isMovable)

  // this use effect steps us through the move reveals to see if the player wins/loses
  useEffect(() => {
    if (typeof revealingMoveIndex !== 'number' || !playerPiece) {
      // do nothing, we're not actually revealing yet
      return
    }

    // if we've revealed all moves, stop the timer and determine if we won or lost
    if (revealingMoveIndex === moves.length) {
      cancelTimer(MOVE_TIMER)
      cancelTimer(OPPONENT_MOVE_TIMER)
      // HERE determine win / loss

      if (pieces.find(p => p.isBlack)) {
        // if there are any pawns left, we win
        props.onLose(moves)
        resetBoard()
      } else {
        props.onWin(moves)
      }
      return
    }

    const nextMove = moves[revealingMoveIndex]
    // we remove any pawns that might have been on that nextMove square
    const nextPieces = pieces.filter(
      p => !isSameSquare(p, nextMove) || !p.isBlack,
    )

    playerPiece.row = nextMove.row
    playerPiece.column = nextMove.column
    setPieces(nextPieces)

    setTimer(
      OPPONENT_MOVE_TIMER,
      () => {
        // if any pawns have reached the end, we lose
        if (
          nextPieces.filter(p => p.isBlack && p.row === BOARD_SIZE - 1).length >
          0
        ) {
          setTimer()
          props.onLose(moves)
          resetBoard()
          return
        }

        const postPieces = nextPieces.map(piece => {
          if (piece.isBlack) {
            if (piece.currentMoveDelay > 0) {
              piece.currentMoveDelay--
            } else {
              const nextRow = piece.row + 1

              if (
                !nextPieces.find(
                  p => p.row === nextRow && p.column === piece.column,
                )
              ) {
                piece.row = nextRow

                if (nextRow === BOARD_SIZE - 1) {
                  piece.type = PIECE_QUEEN
                }
              }

              piece.currentMoveDelay = piece.startingMoveDelay
            }
          }

          return piece
        })

        // here we advance the opponent pieces
        setPieces(postPieces)
      },
      OPPONENT_MOVE_DELAY,
    )
  }, [revealingMoveIndex])

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
    if (isShowingMoves) {
      return
    }

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
    if (isShowingMoves) {
      return
    }

    const hoveringPiece = pieces.find(p => isSameSquare(p, s))
    setHoveringPiece(hoveringPiece)

    if (
      (!hoveringPiece && isSameSquare(s, playerPieceLatestMovePosition)) ||
      (hoveringPiece && hoveringPiece.isMovable && moves.length === 0)
    ) {
      setHoveringPiece(s)
    }
  }

  const handleSubmitMoves = () => {
    setHoveringPiece(null)
    setIsShowingMoves(true)

    const progressMove = () => {
      setRevealingMoveIndex(i => {
        if (i === null) {
          return 0
        }

        return i + 1
      })
      setTimer(MOVE_TIMER, progressMove, MOVE_DELAY)
    }

    progressMove()
  }

  const handleResetMoves = () => {
    resetBoard()
  }

  const showHighlights = hoveringPiece && !hoveringPiece.id

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
    <div className="premove-level">
      <ChessBoard
        dimension={BOARD_SIZE}
        pieces={piecesToRender}
        renderPiece={p => {
          if (p.type === PIECE_SQUARE_HIGHLIGHT) {
            return isShowingMoves ? null : (
              <HighlightSquare isBlack={p.isBlack} label={p.label} />
            )
          } else {
            return (
              <ChessPiece
                type={p.type}
                isBlack={p.isBlack}
                moveCount={p.currentMoveDelay}
                isHovered={hoveringPiece && isSameSquare(p, hoveringPiece)}
              />
            )
          }
        }}
        onClickSquare={handleClickSquare}
        onPlacePiece={handleClickSquare}
        onHoverSquare={handleHoverSquare}
      />
      <PremoveControls
        hasMoves={moves.length > 0}
        disableReset={
          Array.isArray(props.initializeMoves) &&
          props.initializeMoves.length > 0
        }
        onReset={handleResetMoves}
        onSubmit={handleSubmitMoves}
      />
    </div>
  )
}

PremoveLevel.propTypes = {
  level: PropTypes.number,
  seed: PropTypes.string,
  onWin: PropTypes.func,
  onLose: PropTypes.func,
  initializeMoves: PropTypes.array,
}

export default PremoveLevel

// --------------------------------------------------------------------------------
// HELPER FUNCTIONS

const PLAYER_ID = uuid()

/**
 * @param {{next: function}} rand
 * @return {boolean}
 */
function flipCoin(rand) {
  return rand.next().value % 2 === 0
}

/**
 * @param {number} level
 * @param {string} seed
 * @param {number} boardSize
 * @returns {Promise<Array<Piece>>}
 */
export async function getBoardPiecesFromLevelAndSeed(level, seed, boardSize) {
  const rand = await randomGenerator(`${seed}-${level}`)
  const retVal = []
  // we don't want them starting any closer than 3 rows from the end
  const maxRow = boardSize - 3

  const numPawns = Math.max(1, Math.ceil(Math.log(level)))

  for (let i = 0; i < numPawns; i++) {
    let nextPiece
    do {
      const row = rand.next().value % maxRow
      const column = rand.next().value % boardSize
      // iwe randomly have a delay, but we're on the max row and there's multiple pawns, we MUST have a delay
      const hasDelay = flipCoin(rand) || (numPawns > 1 && row === maxRow)
      const delayAmount = hasDelay ? rand.next().value % numPawns : 0

      nextPiece = {
        id: uuid(),
        type: PIECE_PAWN,
        row: row,
        column: column,
        isBlack: true,
        startingMoveDelay: delayAmount,
      }
      nextPiece.currentMoveDelay = nextPiece.startingMoveDelay
    } while (
      retVal.some(p => p.row === nextPiece.row && p.column === nextPiece.column)
    )

    retVal.push(nextPiece)
  }

  retVal.push({
    id: PLAYER_ID,
    type: PIECE_KNIGHT,
    row: 7,
    column: flipCoin(rand) ? 1 : 6,
    isMovable: true,
  })

  return retVal
}
