import React, {useEffect, useState, useRef} from 'react'
import './PremoveLevel.scss'
import ChessBoard from '../elements/ChessBoard'
import ChessPiece from '../elements/ChessPiece'
import PropTypes from 'prop-types'
import {v4 as uuid} from 'uuid'
import {
  constructClassString,
  getSquareKey,
  randomGenerator,
} from '../../utilities'
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
import ChessPieceAnimateOutcome from '../elements/ChessPieceAnimateOutcome'

const WIN = 'win'
const LOSE = 'lose'

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
  const [gameOver, setGameOver] = useState(null)

  const resetBoard = () => {
    cancelAllTimers()
    setGameOver(null)
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

  // if seed of level change we reset the board
  useEffect(() => {
    resetBoard()
  }, [props.seed, props.level, props.initializeMoves])

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
      if (pieces.find(p => p.isBlack)) {
        // if there are any pawns left, we lose
        handleLose()
      } else {
        handleWin()
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
          handleLose()
          return
        }

        // we advance the opponent pieces
        const postPieces = nextPieces.map(piece => {
          if (!piece.isBlack) {
            return piece
          }

          if (piece.currentMoveDelay > 0) {
            // if they have a move delay, we just decrement it and wait
            piece.currentMoveDelay--
          } else {
            // otherwise we prepare to move them forward
            const nextRow = piece.row + 1

            // determine if there's a piece on their next row
            const pieceOnNextRow = nextPieces.find(
              p => p.row === nextRow && p.column === piece.column,
            )

            // if there isn't, we move them forward
            if (!pieceOnNextRow) {
              piece.row = nextRow

              // if they're now on the back rank, they become a queen
              if (nextRow === BOARD_SIZE - 1) {
                piece.type = PIECE_QUEEN
              }

              // since at this point they "moved", we reset their move delay
              // if it's their turn to move, but they haven't moved yet, we won't reset the counter
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

  const handleLose = () => {
    cancelAllTimers()
    // center them in the board
    playerPiece.row = 2
    playerPiece.column = 2
    setGameOver(LOSE)
  }

  const handleWin = () => {
    cancelAllTimers()
    // center them in the board
    playerPiece.row = 2
    playerPiece.column = 2
    setGameOver(WIN)
  }

  const handleAnimationComplete = () => {
    if (gameOver === WIN) {
      if (typeof props.onWin === 'function') {
        props.onWin(moves)
      }
    } else if (typeof props.onLose === 'function') {
      props.onLose(moves)
    }
    setGameOver(null)
    resetBoard()
  }

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
      isShowingMoves ||
      (Array.isArray(props.initializeMoves) && props.initializeMoves.length > 0)
    ) {
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
    if (
      isShowingMoves ||
      (Array.isArray(props.initializeMoves) && props.initializeMoves.length > 0)
    ) {
      return
    }

    const hoveringPiece = pieces.find(p => isSameSquare(p, s))
    setHoveringPiece(hoveringPiece)

    if (
      (!hoveringPiece &&
        playerPieceLatestMovePosition &&
        isSameSquare(s, playerPieceLatestMovePosition)) ||
      (hoveringPiece && hoveringPiece.isMovable && moves.length === 0)
    ) {
      setHoveringPiece(s)
    }
  }

  const handleSubmitMoves = () => {
    if (isShowingMoves) {
      return
    }

    setHoveringPiece(null)
    setIsShowingMoves(true)

    if (typeof props.onSubmit === 'function') {
      props.onSubmit(moves)
    }

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
      Object.values(
        moves
          .map((m, i) => ({
            ...m,
            type: PIECE_SQUARE_HIGHLIGHT,
            label: `${i + 1}`,
            isBlack: true,
          }))
          .reduce((agr, m) => {
            const key = getSquareKey(m)
            if (agr[key]) {
              agr[key].label = `${agr[key].label},${m.label}`
            } else {
              agr[key] = m
            }
            return agr
          }, {}),
      ),
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
            if (p.id === PLAYER_ID && gameOver) {
              return (
                <ChessPieceAnimateOutcome
                  isWin={gameOver === WIN}
                  onComplete={handleAnimationComplete}
                />
              )
            } else {
              return (
                <ChessPiece
                  type={p.type}
                  isBlack={p.isBlack}
                  moveCount={p.currentMoveDelay}
                  isTopRow={p.row === 0}
                  isHovered={hoveringPiece && isSameSquare(p, hoveringPiece)}
                />
              )
            }
          }
        }}
        onClickSquare={handleClickSquare}
        onPlacePiece={handleClickSquare}
        onHoverSquare={handleHoverSquare}
        // animatePattern={!props.level ? IDLE_ANIMATE_PATTERN_FINAL : undefined}
      />
      <PremoveControls
        hasMoves={moves.length > 0}
        disableReset={
          Array.isArray(props.initializeMoves) &&
          props.initializeMoves.length > 0
        }
        disableSubmit={isShowingMoves}
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
  onSubmit: PropTypes.func,
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
  if (!level) {
    return []
  }

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
