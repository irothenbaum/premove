import React, {useEffect, useState} from 'react'
import './PremoveGame.scss'
import ChessBoard from './elements/ChessBoard'
import {v4 as uuid} from 'uuid'
import BootLoader from './BootLoader'
import HUD from './scenes/HUD'
import GameContext from '../contexts/GameContext'

function PremoveGame(props) {
  const [level, setLevel] = useState(1)
  const [seed, setSeed] = useState(uuid())
  const [score, setScore] = useState(0)

  useEffect(() => {
    setLevel(1)
    setScore(0)
  }, [seed])

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
          <ChessBoard dimension={8} />
        </div>
        <div className="hud-container">
          <HUD />
        </div>
      </div>
    </GameContext.Provider>
  )
}

export default PremoveGame
