import React from 'react'
import PropTypes from 'prop-types'
import './StringInput.scss'
import {inputProps} from '../../constants/propTypes'
import {constructClassString} from '../../utilities'

function StringInput({value, onChange, className, ...rest}) {
  return (
    <div className={constructClassString('string-input', className)}>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        {...rest}
      />
    </div>
  )
}

StringInput.propTypes = {
  ...inputProps,
  value: PropTypes.string,
}

export default StringInput
