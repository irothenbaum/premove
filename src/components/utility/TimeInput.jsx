import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import './TimeInput.scss'
import NumberInput from './NumberInput'
import {
  constructClassString,
  timeMSToParts,
  timePartsToMS,
} from '../../utilities'
import Icon, {CHECK, CLOSE} from './Icon'

function TimeInput(props) {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const [m, s] = timeMSToParts(props.value || 0)
    setMinutes(m)
    setSeconds(s)
  }, [props.value])

  const handleSave = () => {
    props.onChange(timePartsToMS(minutes, seconds))
  }

  const handleChangeMinutes = value => {
    setMinutes(Math.max(0, Math.min(value, 60)))
  }

  const handleChangeSeconds = value => {
    setSeconds(Math.max(0, Math.min(value, 60)))
  }

  const handleCancel = () => {
    const [m, s] = timeMSToParts(props.value || 0)
    setMinutes(m)
    setSeconds(s)
    props.onCancel()
  }

  const [prevM, prevS] = timeMSToParts(props.value || 0)
  const hasChanges = prevM !== minutes || prevS !== seconds

  return (
    <div className={constructClassString('time-input', {changes: hasChanges})}>
      <Icon icon={CLOSE} onClick={handleCancel} />

      <div className="time-input-inner">
        <NumberInput value={minutes} onChange={handleChangeMinutes} />
        <span>:</span>
        <NumberInput
          value={seconds}
          onChange={handleChangeSeconds}
          padDigits={2}
        />
      </div>

      <Icon icon={CHECK} onClick={handleSave} />
    </div>
  )
}

TimeInput.propTypes = {
  id: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
}

export default TimeInput
