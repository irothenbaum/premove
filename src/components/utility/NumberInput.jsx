import React from 'react'
import PropTypes from 'prop-types'
import './NumberInput.scss'
import {inputProps} from '../../constants/propTypes'
import {constructClassString} from '../../utilities'

function NumberInput({value, onChange, padDigits, className, ...rest}) {
  const valueFormatted = ('' + (value || 0)).padStart(padDigits || 0, '0')

  return (
    <div className={constructClassString('number-input', className)}>
      <input
        type="numeric"
        value={valueFormatted}
        onChange={e => onChange(parseInt(e.target.value || 0))}
        {...rest}
      />
    </div>
  )
}

NumberInput.propTypes = {
  ...inputProps,
  value: PropTypes.number,
  padDigits: PropTypes.number,
}

export default NumberInput
