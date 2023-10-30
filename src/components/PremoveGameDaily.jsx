import React, {useEffect, useState} from 'react'
import BootLoader from './BootLoader'
import './PremoveGameDaily.scss'
import PremoveLevel from './scenes/PremoveLevel'
import moment from 'moment'
import DailyHUD from './scenes/DailyHUD'
import {
  DIFFICULTY_EASY,
  DIFFICULTY_MODERATE,
  DIFFICULTY_HARD,
  DIFFICULTY_ORDER,
} from '../constants/game'
import SessionContext, {
  HydratedSession,
  flushSession,
} from '../contexts/SessionContext'
import PropTypes from 'prop-types'

const difficultyToLevelMap = {
  [DIFFICULTY_EASY]: 1,
  [DIFFICULTY_MODERATE]: 6,
  [DIFFICULTY_HARD]: 20,
}

function PremoveGameDaily(props) {
  const [seed, setSeed] = useState(getTodaySeed())
  // the difficulty is the "level"
  const [difficulty, setDifficulty] = useState(DIFFICULTY_EASY)
  const [session, setSession] = useState(HydratedSession)

  // right on mount we getTodayProgress so we know the session exists
  useEffect(() => {
    getTodayProgress()
  }, [])

  // whenever state session changes, we flush
  useEffect(() => {
    flushSession(session)
  }, [session])

  const getTodayProgress = () => {
    if (!session.progress[seed]) {
      const newProgress = createDayProgressObject()
      setSession({
        ...session,
        progress: {...session.progress, [seed]: newProgress},
      })
      return newProgress
    }

    return session.progress[seed]
  }

  const handleClickSubmit = () => {
    const todayProgress = getTodayProgress()
    // we don't modify count if it was already solved
    if (todayProgress[difficulty].solved) {
      return
    }

    todayProgress[difficulty].attempts++
    setSession({...session, [seed]: todayProgress})
  }

  /**
   * @param {Array<Square>} moves
   */
  const handleWin = moves => {
    const todayProgress = getTodayProgress()

    // we don't overwrite if it was already solved
    if (todayProgress[difficulty].solved) {
      return
    }

    // increase attempts count, mark the win, and set the moves array
    todayProgress[difficulty].moves = moves
    todayProgress[difficulty].solved = true

    setSession({...session, [seed]: todayProgress})

    if (difficulty === DIFFICULTY_HARD) {
      // TODO: would be nice to show Share Results or something
    } else {
      // move to next difficulty
      setDifficulty(DIFFICULTY_ORDER[DIFFICULTY_ORDER.indexOf(difficulty) + 1])
    }
  }

  /**
   * @param {Array<Square>} moves
   */
  const handleLose = moves => {
    // we don't actually need to do anything since we recorded the attempt when they clicked Submit
  }

  if (!session.progress[seed]) {
    return null
  }

  const selectedDifficulty = session.progress[seed][difficulty]

  return (
    <SessionContext.Provider
      value={{
        progress: session.progress[seed],
        hasReadRules: session.hasReadRules,

        setHasReadRules: () => {
          setSession({...session, hasReadRules: true})
        },
        getTodayProgress: getTodayProgress,
      }}>
      <BootLoader onPlayInfinite={props.onPlayInfinite} />
      <div className="premove-game-daily">
        <div className="hud-container">
          <DailyHUD difficulty={difficulty} onChange={setDifficulty} />
        </div>
        <div className="board-container">
          <PremoveLevel
            level={difficultyToLevelMap[difficulty]}
            seed={seed}
            onSubmit={handleClickSubmit}
            onLose={handleLose}
            onWin={handleWin}
            initializeMoves={
              selectedDifficulty?.solved ? selectedDifficulty.moves : undefined
            }
          />
        </div>
      </div>
    </SessionContext.Provider>
  )
}

PremoveGameDaily.propTypes = {
  onPlayInfinite: PropTypes.func,
}

export default PremoveGameDaily

/**
 * @return {string}
 */
function getTodaySeed() {
  return moment().add(3, 'day').format('YYYY-MM-DD')
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
