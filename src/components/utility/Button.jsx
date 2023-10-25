import React from 'react'
import PropTypes from 'prop-types'
import './Button.scss'
import {constructClassString} from '../../utilities'

function Button(props) {
  return (
    <div
      className={constructClassString('button-container', props.className, {
        disabled: !!props.disabled,
      })}>
      <button onClick={() => (props.disabled ? undefined : props.onClick())}>
        {props.title}
      </button>
    </div>
  )
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

export default Button
