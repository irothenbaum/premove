import React from 'react'
import './HighlightSquare.scss'
import {constructClassString} from '../../utilities'
import PropTypes from 'prop-types'

function HighlightSquare(props) {
  const labelItems = (props.label || '').split(',').map((label, index) => {
    return <span key={label}>{label}</span>
  })

  return (
    <div
      className={constructClassString('highlight-square', {
        black: props.isBlack,
        compressed: props.label.length > 2,
      })}>
      {labelItems}
    </div>
  )
}

HighlightSquare.propTypes = {
  isBlack: PropTypes.bool,
  label: PropTypes.string,
}

export default HighlightSquare
