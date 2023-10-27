import React, {useContext} from 'react'
import './DailyHUD.scss'
import Button, {
  VARIANT_SECONDARY,
  VARIANT_TERTIARY,
  VARIANT_PRIMARY,
} from '../utility/Button'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  DIFFICULTY_EASY,
  DIFFICULTY_MODERATE,
  DIFFICULTY_HARD,
} from '../../constants/game'
import SessionContext from '../../contexts/SessionContext'
import Icon, {SHARE, CHEVRON_RIGHT} from '../utility/Icon'

const difficultyLabels = {
  [DIFFICULTY_EASY]: 'Easy',
  [DIFFICULTY_MODERATE]: 'Moderate',
  [DIFFICULTY_HARD]: 'Hard',
}

function DailyHUD(props) {
  const {progress} = useContext(SessionContext)

  const handleShareResults = () => {
    window.alert('Share results')
  }

  return (
    <div className="daily-hud">
      <div className="title-container">
        <h1>Premove</h1>
        <h2>{moment().format('LL')}</h2>
      </div>

      <div className="difficulty-container">
        {Object.keys(difficultyLabels).map(difficulty => {
          return (
            <Button
              key={difficulty}
              onClick={() => props.onChange(difficulty)}
              variant={
                progress[difficulty].solved
                  ? VARIANT_TERTIARY
                  : props.difficulty === difficulty
                  ? VARIANT_PRIMARY
                  : VARIANT_SECONDARY
              }>
              <span>{difficultyLabels[difficulty]}</span>{' '}
              <span>
                {progress[difficulty].attempts || <Icon icon={CHEVRON_RIGHT} />}
              </span>
            </Button>
          )
        })}
      </div>
      <div className="results-container">
        <Button
          onClick={handleShareResults}
          disabled={Object.values(progress).every(p => p.attempts === 0)}>
          <Icon icon={SHARE} />
          Share results
        </Button>
      </div>
    </div>
  )
}

export default DailyHUD

DailyHUD.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
