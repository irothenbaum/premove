import React, {useEffect, useState} from 'react'
import './PremoveGame.scss'
import ChessBoard from './elements/ChessBoard'
import {v4 as uuid} from 'uuid'
import BootLoader from './BootLoader'
import HUD from './scenes/HUD'
import GameContext from '../contexts/GameContext'
import {PIECE_KNIGHT, PIECE_PAWN} from '../constants/chess'
import ChessPiece from './elements/ChessPiece'

const allowedKnightSquareChanges = [-2, -1, 1, 2]

function PremoveGame(props) {
  const [level, setLevel] = useState(1)
  const [seed, setSeed] = useState(uuid())
  const [score, setScore] = useState(0)

  const [pieces, setPieces] = useState([
    {
      id: uuid(),
      row: 2,
      column: 3,
      type: PIECE_PAWN,
      isBlack: true,
    },
    {
      id: uuid(),
      row: 5,
      column: 6,
      type: PIECE_KNIGHT,
      isMovable: true,
    },
  ])

  useEffect(() => {
    setLevel(1)
    setScore(0)
  }, [seed])

  const handleClickSquare = (row, column) => {
    const playerPiece = pieces.find(p => p.isMovable)

    if (!playerPiece) {
      return
    }

    const diffRow = row - playerPiece.row
    const diffColumn = column - playerPiece.column

    // this is how we validated a knight move
    if (
      !allowedKnightSquareChanges.includes(diffRow) ||
      !allowedKnightSquareChanges.includes(diffColumn) ||
      Math.abs(diffRow) === Math.abs(diffColumn)
    ) {
      return
    }

    playerPiece.row = row
    playerPiece.column = column

    setPieces(pieces => [...pieces])
  }

  return (
    <GameContext.Provider
      value={{
        level,
        score,

        goToNextLevel: () => setLevel(l => l + 1),
        incrementScore: amount => setScore(s => s + amount),
      }}>
      <BootLoader />
      <div className="premove-game">
        <div className="board-container">
          <ChessBoard
            pieces={pieces}
            renderPiece={p => <ChessPiece piece={p} />}
            onClickSquare={handleClickSquare}
          />
        </div>
        <div className="hud-container">
          <HUD />
        </div>
      </div>
    </GameContext.Provider>
  )
}

export default PremoveGame
