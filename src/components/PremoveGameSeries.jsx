import React, {useEffect, useState} from 'react'
import BootLoader from './BootLoader'
import './PremoveGameDaily.scss'
import SeriesHUD from './scenes/SeriesHUD'
import PremoveLevel from './scenes/PremoveLevel'
import {v4 as uuid} from 'uuid'
import SessionContext, {
  flushSession,
  HydratedSession,
} from '../contexts/SessionContext'

function PremoveGameSeries(props) {
  const [session, setSession] = useState(HydratedSession)

  const [level, setLevel] = useState(0)
  const [score, setScore] = useState(0)
  const [seed, setSeed] = useState('')

  useEffect(() => {
    handleChangeSeed(uuid())
  }, [])

  // whenever state session changes, we flush
  useEffect(() => {
    flushSession(session)
  }, [session])

  useEffect(() => {
    if (session.series[seed]) {
      setLevel(session.series[seed].level)
      setScore(session.series[seed].score)
    }
  }, [seed])

  const handleWin = moves => {
    const nextLevel = level + 1
    const nextScore = score + moves.length
    setScore(nextScore)
    setLevel(nextLevel)

    // every time we win, we update the sessions data for this seed
    setSession({
      ...session,
      series: {
        ...session.series,
        [seed]: {
          seed: seed,
          level: nextLevel,
          score: nextScore,
        },
      },
    })
  }

  const handleChangeSeed = newSeed => {
    setSeed(newSeed)
    setLevel(1)
    setScore(0)
  }

  return (
    <SessionContext.Provider
      value={{
        series: session.series[seed],
      }}>
      <div className="premove-game-daily">
        <div className="hud-container">
          <SeriesHUD
            level={level}
            score={score}
            seed={seed}
            onChangeSeed={handleChangeSeed}
          />
        </div>
        <div className="board-container">
          <PremoveLevel level={level} seed={seed} onWin={handleWin} />
        </div>
      </div>
    </SessionContext.Provider>
  )
}

export default PremoveGameSeries
