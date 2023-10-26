import React from 'react'
import PropTypes from 'prop-types'
import './Button.scss'
import {constructClassString} from '../../utilities'

function Button(props) {
  return (
    <div
      className={constructClassString('button-container', props.className, {
        secondary: !!props.isSecondary,
        disabled: !!props.disabled,
      })}>
      <button onClick={() => (props.disabled ? undefined : props.onClick())}>
        {props.children}
      </button>
    </div>
  )
}

Button.propTypes = {
  isSecondary: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

export default Button
