import React from 'react'
import './HighlightSquare.scss'
import {constructClassString} from '../../utilities'
import PropTypes from 'prop-types'

function HighlightSquare(props) {
  return (
    <div
      className={constructClassString('highlight-square', {
        black: props.isBlack,
      })}>
      {props.label}
    </div>
  )
}

HighlightSquare.propTypes = {
  isBlack: PropTypes.bool,
  label: PropTypes.string,
}

export default HighlightSquare
