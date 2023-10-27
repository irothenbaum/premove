import React, {useContext, useState} from 'react'
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
import Icon, {SHARE, CHEVRON_RIGHT, INFO} from '../utility/Icon'
import Modal from '../utility/Modal'
import ShareResults from './ShareResults'
import HowToPlay from './HowToPlay'

const difficultyLabels = {
  [DIFFICULTY_EASY]: 'Easy',
  [DIFFICULTY_MODERATE]: 'Moderate',
  [DIFFICULTY_HARD]: 'Hard',
}

function DailyHUD(props) {
  const {progress, hasReadRules, setHasReadRules} = useContext(SessionContext)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [showInstructions, setShowInstructions] = useState(!hasReadRules)

  const handleShareResults = () => {
    setShowResultsModal(true)
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
        <Button onClick={() => setShowInstructions(true)}>
          <Icon icon={INFO} />
          How to play
        </Button>

        <Modal
          onClose={() => setShowResultsModal(false)}
          isOpen={showResultsModal}>
          <ShareResults />
        </Modal>

        <Modal
          onClose={() => {
            setShowInstructions(false)
            setHasReadRules(true)
          }}
          isOpen={showInstructions}>
          <HowToPlay />
        </Modal>
      </div>
    </div>
  )
}

export default DailyHUD

DailyHUD.propTypes = {
  difficulty: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
