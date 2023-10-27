import React, {useState} from 'react'
import BootLoader from './BootLoader'
import './PremoveGameDaily.scss'
import PremoveLevel from './scenes/PremoveLevel'
import moment from 'moment'
import DailyHUD from './scenes/DailyHUD'
import {
  DIFFICULTY_EASY,
  DIFFICULTY_MODERATE,
  DIFFICULTY_HARD,
} from '../constants/game'
import SessionContext, {
  HydratedSession,
  flushSession,
} from '../contexts/SessionContext'

const difficultyToLevelMap = {
  [DIFFICULTY_EASY]: 1,
  [DIFFICULTY_MODERATE]: 5,
  [DIFFICULTY_HARD]: 16,
}

function PremoveGameDaily(props) {
  const [seed, setSeed] = useState(getTodaySeed())
  // the difficulty is the "level"
  const [difficulty, setDifficulty] = useState(DIFFICULTY_EASY)
  const [session, setSession] = useState(HydratedSession)

  /**
   * @param {Array<Square>} moves
   */
  const handleWin = moves => {
    setSession(s => {
      const todayProgress = s[seed] || createDayProgressObject()

      // we don't overwrite if it was already solved
      if (todayProgress[difficulty].solved) {
        return s
      }

      // increase attempts count, mark the win, and set the moves array
      todayProgress[difficulty].attempts++
      todayProgress[difficulty].moves = moves
      todayProgress[difficulty].solved = true

      const updatedValue = {...s, [seed]: todayProgress}
      flushSession(updatedValue)
      return updatedValue
    })
    window.alert('WIN')
  }

  /**
   * @param {Array<Square>} moves
   */
  const handleLose = moves => {
    setSession(s => {
      const todayProgress = s[seed] || createDayProgressObject()

      // we don't overwrite if it was already solved
      if (todayProgress[difficulty].solved) {
        return s
      }

      // just increase attempts count
      todayProgress[difficulty].attempts++

      const updatedValue = {...s, [seed]: todayProgress}
      flushSession(updatedValue)
      return updatedValue
    })
    window.alert('LOSE')
  }

  return (
    <SessionContext.Provider
      value={{
        progress: session[seed] || createDayProgressObject(),
      }}>
      <BootLoader />
      <div className="premove-game-daily">
        <div className="hud-container">
          <DailyHUD difficulty={difficulty} onChange={setDifficulty} />
        </div>
        <div className="board-container">
          <PremoveLevel
            level={difficultyToLevelMap[difficulty]}
            seed={seed}
            onLose={handleLose}
            onWin={handleWin}
          />
        </div>
      </div>
    </SessionContext.Provider>
  )
}

export default PremoveGameDaily

/**
 * @return {string}
 */
function getTodaySeed() {
  return moment().format('YYYY-MM-DD')
}

const difficultyResults = {attempts: 0, solved: false, moves: []}

/**
 * @return {DailyProgress}
 */
function createDayProgressObject() {
  return {
    [DIFFICULTY_EASY]: {...difficultyResults},
    [DIFFICULTY_MODERATE]: {...difficultyResults},
    [DIFFICULTY_HARD]: {...difficultyResults},
  }
}
