import React, {useContext} from 'react'
import './HUD.scss'
import GameContext from '../../contexts/GameContext'

function HUD(props) {
  const {level, score} = useContext(GameContext)

  return (
    <div className="hud">
      <div className="spacer">
        <div>
          <h1>Premove</h1>
          <h2>
            Level: <span>{level}</span>
          </h2>
          <h2>
            Score: <span>{score}</span>
          </h2>
        </div>
      </div>

      <div className="spacer" />
    </div>
  )
}

export default HUD
