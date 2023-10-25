import React from 'react'
import './Icon.scss'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faCheck,
  faTimes,
  faChess,
  faChevronUp,
  faChevronDown,
  faPlay,
  faPause,
  faClockRotateLeft,
  faPencil,
  faGear,
  faStopwatch,
  faPlus,
  faHourglass,
  faHourglassStart,
  faHourglassEnd,
  faHourglassHalf,
  faClock,
  faVolleyball,
  faBasketball,
  faMedal,
  faHockeyPuck,
  faBaseball,
  faStopwatch20,
  faFutbol,
  faBowlingBall,
  faFootball,
  faChessPawn,
  faChessKnight,
} from '@fortawesome/free-solid-svg-icons'
import {faCircle, faSquare} from '@fortawesome/free-regular-svg-icons'
import {constructClassString} from '../../utilities'

export const CHEVRON_LEFT = faChevronLeft
export const CHEVRON_RIGHT = faChevronRight
export const CHEVRON_UP = faChevronUp
export const CHEVRON_DOWN = faChevronDown
export const SPINNER = faSpinner
export const CHECK = faCheck
export const CLOSE = faTimes
export const PLAY = faPlay
export const STOP = faPause
export const RESET = faClockRotateLeft
export const EDIT = faPencil
export const SETTINGS = faGear
export const STOPWATCH = faStopwatch
export const PLUS = faPlus
export const HOURGLASS_1 = faHourglass
export const HOURGLASS_2 = faHourglassStart
export const HOURGLASS_3 = faHourglassHalf
export const HOURGLASS_4 = faHourglassEnd
export const CLOCK = faClock
export const CIRCLE = faCircle
export const SQUARE = faSquare
export const BASKETBALL = faBasketball
export const WATER_POLO = faVolleyball
export const MEDAL = faMedal
export const HOCKEY = faHockeyPuck
export const BASEBALL = faBaseball
export const STOPWATCH_20 = faStopwatch20
export const SOCCER = faFutbol
export const BOWLING = faBowlingBall
export const FOOTBALL = faFootball
export const CHESS = faChess
export const PAWN = faChessPawn
export const KNIGHT = faChessKnight

function Icon(props) {
  return (
    <span
      style={props.style}
      className={constructClassString(
        {
          'has-click-handler': typeof props.onClick === 'function',
          spin: props.icon === SPINNER,
        },
        props.className,
        'icon-container',
      )}
      onClick={props.onClick}>
      <FontAwesomeIcon icon={props.icon} />
    </span>
  )
}

Icon.propTypes = {
  icon: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default Icon
