import React, {useState, useContext, useEffect} from 'react'
import './ShareResults.scss'
import SessionContext from '../../contexts/SessionContext'
import moment from 'moment'
import {DAY_1, DIFFICULTY_ORDER} from '../../constants/game'
import {constructClassString, pluralize} from '../../utilities'
import Button, {VARIANT_TERTIARY} from '../utility/Button'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import Icon, {CHECK, CLIPBOARD} from '../utility/Icon'

const SOLVED_EMOJI = '🟩'
const NOT_SOLVED_EMOJI = '🟥'

function ShareResults(props) {
  const {getTodayProgress} = useContext(SessionContext)
  const [copied, setCopied] = useState(false)
  const {setTimer} = useDoOnceTimer()

  const progress = getTodayProgress()

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(generateText(progress))
    setCopied(true)
    setTimer('reset-copy', () => setCopied(false), 2000)
  }

  return (
    <div className="share-results-container">
      <h2>Your results for</h2>
      <h1>{moment().format('LL')}</h1>

      <div className="share-results-content">
        <h3>Puzzle #{getPuzzleNumber()}</h3>
        {DIFFICULTY_ORDER.map(difficulty => {
          const thisResult = progress[difficulty]
          return (
            <div
              key={difficulty}
              className={constructClassString('result', {
                solved: thisResult.solved,
              })}>
              {thisResult.attempts > 0 ? (
                <React.Fragment>
                  {thisResult.solved ? (
                    <span>
                      <strong>{thisResult.moves.length}</strong>
                      {pluralize('move', thisResult.moves.length)} in
                    </span>
                  ) : (
                    <span>Failed after</span>
                  )}
                  <strong>{thisResult.attempts}</strong>
                  {pluralize('attempt', thisResult.attempts)}
                </React.Fragment>
              ) : (
                <span>Not attempted</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="share-button-container">
        {copied ? (
          <Button onClick={handleCopyToClipboard} variant={VARIANT_TERTIARY}>
            <Icon icon={CHECK} /> Copied
          </Button>
        ) : (
          <Button onClick={handleCopyToClipboard}>
            <Icon icon={CLIPBOARD} />
            Copy to clipboard
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * @param {boolean} solved
 * @return {string}
 */
function getEmojiFromSolved(solved) {
  return solved ? SOLVED_EMOJI : NOT_SOLVED_EMOJI
}

function getPuzzleNumber() {
  return moment().startOf('day').diff(DAY_1, 'days')
}

/**
 * @param {GameProgress} progress
 * @return {string}
 */
function generateText(progress) {
  return (
    `PREMOVE\nPuzzle #${getPuzzleNumber()}:\n` +
    DIFFICULTY_ORDER.map(
      difficulty =>
        `${getEmojiFromSolved(progress[difficulty].solved)} ${
          progress[difficulty].moves.length || 'X'
        } / ${progress[difficulty].attempts || 0}`,
    ).join('\n')
  )
}

export default ShareResults
