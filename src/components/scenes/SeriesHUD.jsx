import React, {useContext} from 'react'
import './SeriesHUD.scss'
import PropTypes from 'prop-types'
import StringInput from '../utility/StringInput'
import Icon, {INFINITY, RESET} from '../utility/Icon'
import {v4 as uuid} from 'uuid'

function SeriesHUD(props) {
  return (
    <div className="series-hud">
      <div className="spacer">
        <div>
          <h1>
            Premove{' '}
            <span>
              <Icon icon={INFINITY} />
              <Icon icon={INFINITY} />
            </span>
          </h1>
          <h2 className="seed-container">
            Seed:{' '}
            <StringInput onChange={props.onChangeSeed} value={props.seed} />
            <Icon icon={RESET} onClick={() => props.onChangeSeed(uuid())} />
          </h2>
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
  seed: PropTypes.string,
  onChangeSeed: PropTypes.func,
}

export default SeriesHUD
