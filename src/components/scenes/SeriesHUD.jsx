import React, {useContext} from 'react'
import './SeriesHUD.scss'
import GameContext from '../../contexts/GameContext'

function SeriesHUD(props) {
  const {level, score} = useContext(GameContext)

  return (
    <div className="series-hud">
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

export default SeriesHUD
