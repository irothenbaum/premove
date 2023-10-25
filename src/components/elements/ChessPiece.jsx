import React from 'react'
import './ChessPiece.scss'
import PropTypes from 'prop-types'
import {PIECE_KNIGHT, PIECE_PAWN} from '../../constants/chess'
import Pawn from './Pawn'
import Knight from './Knight'

const TYPE_TO_COMPONENT = {
  [PIECE_PAWN]: Pawn,
  [PIECE_KNIGHT]: Knight,
}

function ChessPiece(props) {
  const Component = TYPE_TO_COMPONENT[props.type] || <div>{props.type}</div>

  return (
    <div className="chess-piece">
      <Component />
    </div>
  )
}

ChessPiece.propTypes = {
  type: PropTypes.string.isRequired,
}

export default ChessPiece
