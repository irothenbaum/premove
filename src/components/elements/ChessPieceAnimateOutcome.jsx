import React, {useEffect, useState} from 'react'
import './ChessPieceAnimateOutcome.scss'
import {constructClassString} from '../../utilities'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import Icon, {KING, KNIGHT} from '../utility/Icon'
import PropTypes from 'prop-types'

const READY_TIMER = 'ready-timer'
const READY_DELAY = 0

const FLASH_TIMER = 'flash-timer'
const FLASH_DELAY = 1000
const FLASH_DURATION = 300

const COMPLETE_TIMER = 'complete-timer'
const COMPLETE_DELAY = 1600

function ChessPieceAnimateOutcome(props) {
  const [isReady, setIsReady] = useState(false)
  const [isFlash, setFlash] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const {setTimer} = useDoOnceTimer()

  useEffect(() => {
    setTimer(READY_TIMER, () => setIsReady(true), READY_DELAY)
    setTimer(
      FLASH_TIMER,
      () => {
        setFlash(true)
        setRevealed(true)
        setTimer(
          FLASH_TIMER,
          () => {
            setFlash(false)

            setTimer(COMPLETE_TIMER, props.onComplete, COMPLETE_DELAY)
          },
          FLASH_DURATION,
        )
      },
      FLASH_DELAY,
    )
  }, [])

  const icon = revealed ? (
    props.isWin ? (
      <Icon icon={KING} />
    ) : (
      <span className="sad-face">😭</span>
    )
  ) : (
    <Icon icon={KNIGHT} />
  )

  return (
    <React.Fragment>
      <div
        className={constructClassString('chess-piece-animate-outcome', {
          ready: isReady,
          revealed: revealed,
          win: props.isWin,
          lose: !props.isWin,
        })}>
        <div className="chess-piece-inner">{icon}</div>
      </div>
      {isFlash && <div className="flash" />}
    </React.Fragment>
  )
}

ChessPieceAnimateOutcome.propTypes = {
  isWin: PropTypes.bool,
  onComplete: PropTypes.func,
}

export default ChessPieceAnimateOutcome
