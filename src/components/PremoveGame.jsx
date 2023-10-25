import React, {useEffect, useState} from 'react'
import './PremoveGame.scss'
import ChessBoard from './elements/ChessBoard'
import {v4 as uuid} from 'uuid'
import BootLoader from './BootLoader'
import HUD from './scenes/HUD'
import GameContext from '../contexts/GameContext'
import {PIECE_PAWN} from '../constants/chess'

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
    },
  ])

  useEffect(() => {
    setLevel(1)
    setScore(0)
  }, [seed])

  const handleClickSquare = (row, column) => {
    console.log(row, column)
    const targetPiece = pieces[0]
    targetPiece.row = row
    targetPiece.column = column
    setPieces([targetPiece])
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
            renderPiece={p => <div>{p.type}</div>}
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
