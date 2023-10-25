import React, {useContext, forwardRef, useEffect} from 'react'
import './Scoreboard.scss'
import Scores from './scoreboard/Scores'
import GameAndShotClocks from './scoreboard/GameAndShotClocks'
import {constructClassString} from '../../utilities'
import GameContext from '../../contexts/GameContext'
import useSoundPlayer, {SOUND_BUZZER} from '../../hooks/useSoundPlayer'
import Period from './scoreboard/Period'
import BootLoader from '../BootLoader'

const Scoreboard = forwardRef(function Scoreboard(props, ref) {
  const {isShotClockExpired, isGameClockExpired} = useContext(GameContext)
  const {playSound, stopSound} = useSoundPlayer()
  // // TODO: Trying to implement some local caching in case screen gets refreshed
  // useEffect(() => {
  //   flushGame({
  //     homeScore,
  //     visitorScore,
  //     shotClockRemaining,
  //     gameClockRemaining,
  //   })
  // }, [gameClockRemaining, homeScore, visitorScore, shotClockRemaining])

  useEffect(() => {
    if (isGameClockExpired) {
      playSound(SOUND_BUZZER)
    }
  }, [isGameClockExpired])

  return (
    <div
      className={constructClassString('scoreboard', {
        ['shot-clock-expired']: isShotClockExpired,
        ['game-clock-expired']: isGameClockExpired,
      })}
      ref={ref}>
      <BootLoader />
      <Period />
      <Scores />
      <GameAndShotClocks />
    </div>
  )
})

Scoreboard.propTypes = {}

export default Scoreboard
