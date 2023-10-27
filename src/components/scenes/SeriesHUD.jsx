import React, {useContext} from 'react'
import './SeriesHUD.scss'
import PropTypes from 'prop-types'

function SeriesHUD(props) {
  return (
    <div className="series-hud">
      <div className="spacer">
        <div>
          <h1>Premove</h1>
          <h2>
            Level: <span>{props.level}</span>
          </h2>
          <h2>
            Score: <span>{props.score}</span>
          </h2>
        </div>
      </div>
    </div>
  )
}

SeriesHUD.propTypes = {
  level: PropTypes.number,
  score: PropTypes.number,
}

export default SeriesHUD
