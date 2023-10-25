import React from 'react'
import PropTypes from 'prop-types'
import Icon, {
  WATER_POLO,
  BASKETBALL,
  STOPWATCH,
  PLUS,
  HOURGLASS_1,
  HOURGLASS_2,
  HOURGLASS_3,
  HOURGLASS_4,
  CLOCK,
  CIRCLE,
  SQUARE,
  CHECK,
  CLOSE,
  PLAY,
  STOP,
  RESET,
  EDIT,
  MEDAL,
  HOCKEY,
  BASEBALL,
  FOOTBALL,
  BOWLING,
  SOCCER,
  STOPWATCH_20,
} from './Icon'
import './IconSelector.scss'
import SelectInput from './SelectInput'

const DEFAULT_ICONS = [
  CHECK,
  CLOSE,
  PLAY,
  STOP,
  RESET,
  EDIT,
  STOPWATCH,
  STOPWATCH_20,
  PLUS,
  HOURGLASS_1,
  HOURGLASS_2,
  HOURGLASS_3,
  HOURGLASS_4,
  CLOCK,
  CIRCLE,
  SQUARE,
  BASKETBALL,
  WATER_POLO,
  MEDAL,
  HOCKEY,
  BASEBALL,
  FOOTBALL,
  BOWLING,
  SOCCER,
]

function IconSelector(props) {
  return (
    <SelectInput
      className="icon-selector"
      onChange={props.onChange}
      options={props.options || DEFAULT_ICONS}
      value={props.value}
      renderOption={(i, index) =>
        i ? <Icon key={index} icon={i} /> : <span>?</span>
      }
    />
  )
}

IconSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  options: PropTypes.array,
}

export default IconSelector
