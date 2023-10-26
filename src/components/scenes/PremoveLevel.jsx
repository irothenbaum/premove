import React, {useEffect, useState} from 'react'
import './PremoveLevel.scss'
import ChessBoard from '../elements/ChessBoard'
import ChessPiece from '../elements/ChessPiece'
import PropTypes from 'prop-types'
import {v4 as uuid} from 'uuid'
import {randomGenerator} from '../../utilities'
import {BOARD_SIZE, PIECE_KNIGHT, PIECE_PAWN} from '../../constants/chess'

function PremoveLevel(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [pieces, setPieces] = useState([])
  /** @type {Array<{row: number, column: number}>} */
  const [moves, setMoves] = useState([])

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

  /**
   * @param {number} row
   * @param {number} column
   * @param {Piece?} piece
   */
  const handleClickSquare = (row, column, piece) => {}

  return (
    <ChessBoard
      dimension={BOARD_SIZE}
      pieces={pieces}
      renderPiece={p => (
        <ChessPiece type={p.type} isBlack={p.isBlack} moveCount={p.moveCount} />
      )}
      onClickSquare={handleClickSquare}
      onPlacePiece={handleClickSquare}
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
  })

  return retVal
}
