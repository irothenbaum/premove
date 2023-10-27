import React, {useState} from 'react'
import BootLoader from './BootLoader'
import './PremoveGameSeries.scss'
import SeriesHUD from './scenes/SeriesHUD'
import PremoveLevel from './scenes/PremoveLevel'
import {v4 as uuid} from 'uuid'

function PremoveGameSeries(props) {
  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [seed, setSeed] = useState(uuid())

  const handleWin = () => {
    window.alert('WIN')
  }

  const handleLose = () => {
    window.alert('LOSE')
  }

  return (
    <React.Fragment>
      <BootLoader />
      <div className="premove-game-series">
        <div className="board-container">
          <PremoveLevel
            level={level}
            seed={seed}
            onLose={handleLose}
            onWin={handleWin}
          />
        </div>
        <div className="hud-container">
          <SeriesHUD level={level} score={score} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default PremoveGameSeries
