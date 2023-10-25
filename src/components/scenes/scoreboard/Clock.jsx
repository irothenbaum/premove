import React, {useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'
import './Clock.scss'
import {constructClassString, timeMSToParts} from '../../../utilities'
import Icon, {PLAY, EDIT, STOP, RESET} from '../../utility/Icon'
import TimeInput from '../../utility/TimeInput'
import useDoOnceTimer from '../../../hooks/useDoOnceTimer'

/**
 * @param {number} num
 * @return {string}
 */
function zeroPad(num) {
  return ('' + num).padStart(2, '0')
}

const ANIMATE_NONE = 0
const ANIMATE_START = 1
const ANIMATE_STOP = 2
const ANIMATE_RESET = 3

const TIMER_ANIMATION = 'animation'
const TIMER_INITIALIZATION = 'initialization'
const TIMER_CLOCK = 'clock'

function Clock(props) {
  // cached time is used when they're editing the value so it doesn't keep changing
  const [cachedTime, setCachedTime] = useState(null)

  // hasInitialized is used to prevent the animation from running on first render
  const hasInitialized = useRef(false)

  // show MS if we're under 10 seconds left
  const showMilliseconds = props.timeMS < 60000
  const [animateMode, setAnimateMode] = useState(ANIMATE_NONE)
  const {setTimer, cancelTimer} = useDoOnceTimer()
  const [isEditing, setIsEditing] = useState(false)

  // this is a cached copy of timeMS which we use to animate the time remaining
  const [timeRemaining, setTimeRemaining] = useState(props.timeMS)
  const [minutes, seconds, milliseconds] = timeMSToParts(timeRemaining)
  const endTimeRef = useRef()

  const refreshTimeRemaining = () => {
    setTimeRemaining(
      Math.max(0, (endTimeRef.current || Date.now()) - Date.now()),
    )
  }

  useEffect(() => {
    if (isEditing) {
      setCachedTime(props.timeMS)
    } else {
      setCachedTime(null)
    }
  }, [isEditing])

  useEffect(() => {
    setTimer(
      TIMER_INITIALIZATION,
      () => {
        hasInitialized.current = true
      },
      500,
    )

    refreshTimeRemaining()
  }, [])

  useEffect(() => {
    // initialize our end time and refresh our cache copy of the time remaining
    endTimeRef.current = Date.now() + props.timeMS

    if (props.isRunning) {
      const tick = () => {
        refreshTimeRemaining()
        setTimer(TIMER_CLOCK, tick, 100) // update our clock 10x per second
      }

      tick()
    } else {
      refreshTimeRemaining()
      cancelTimer(TIMER_CLOCK, null)
    }
  }, [props.isRunning, props.timeMS])

  // -------------------------------------------------------------------------------------------------------------
  // There are animation effect functions and should not be used for logic because they will not run immediately
  useEffect(() => {
    if (!hasInitialized.current) {
      return
    }

    if (props.isRunning) {
      setAnimateMode(ANIMATE_START)
    } else {
      setAnimateMode(ANIMATE_STOP)
    }

    setTimer(TIMER_ANIMATION, () => setAnimateMode(ANIMATE_NONE), 500)
  }, [props.isRunning])

  // useEffect(() => {
  //   if (!hasInitialized.current) {
  //     return
  //   }
  //
  //   setAnimateMode(ANIMATE_RESET)
  //   setTimer(TIMER_ANIMATION, () => setAnimateMode(ANIMATE_NONE), 500)
  // }, [props.timeMS])
  // -------------------------------------------------------------------------------------------------------------

  return (
    <div
      className={constructClassString('clock', props.className, {
        start: animateMode === ANIMATE_START,
        stop: animateMode === ANIMATE_STOP,
        reset: animateMode === ANIMATE_RESET,
      })}>
      <h3 className="clock-label">{props.label}</h3>
      <div className="clock-value">
        {!props.hideMinutes && (
          <span
            className={constructClassString({
              disabled: minutes === 0,
            })}>
            <span className="minutes">
              {minutes > 0 ? minutes : zeroPad(minutes)}
            </span>
            <span className="colon">:</span>
          </span>
        )}
        <span className="seconds">{zeroPad(seconds)}</span>
        {showMilliseconds && (
          <React.Fragment>
            <span className="period">.</span>
            <span className="milliseconds">{zeroPad(milliseconds)}</span>
          </React.Fragment>
        )}
      </div>

      <div className="clock-controls">
        <span>
          <Icon icon={RESET} onClick={props.onReset} />
        </span>
        <span className="playback-controls">
          <Icon icon={PLAY} onClick={props.onStart} />
          <Icon icon={STOP} onClick={props.onStop} />
        </span>
        <span>
          <Icon icon={EDIT} onClick={() => setIsEditing(true)} />
        </span>
        <div
          className={constructClassString('edit-clock', {
            open: isEditing,
          })}>
          <TimeInput
            value={cachedTime}
            onChange={v => {
              props.onChange(v)
              setIsEditing(false)
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>

      <div className="animate-effect">
        <Icon
          icon={
            animateMode === ANIMATE_START
              ? PLAY
              : animateMode === ANIMATE_STOP
              ? STOP
              : RESET
          }
        />
      </div>
    </div>
  )
}

Clock.propTypes = {
  label: PropTypes.string,
  timeMS: PropTypes.number.isRequired,
  hideMinutes: PropTypes.bool,
  className: PropTypes.string,
  isRunning: PropTypes.bool,

  onReset: PropTypes.func,
  onStart: PropTypes.func,
  onStop: PropTypes.func,
  onChange: PropTypes.func,
}

export default Clock
