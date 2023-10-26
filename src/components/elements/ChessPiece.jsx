import React from 'react'
import './ChessPiece.scss'
import PropTypes from 'prop-types'
import {PIECE_KNIGHT, PIECE_PAWN} from '../../constants/chess'
import {constructClassString} from '../../utilities'
import Icon, {PAWN, KNIGHT} from '../utility/Icon'

const TYPE_TO_ICON = {
  [PIECE_PAWN]: PAWN,
  [PIECE_KNIGHT]: KNIGHT,
}

function ChessPiece(props) {
  return (
    <div
      className={constructClassString('chess-piece', {black: props.isBlack})}>
      <div className="chess-piece-inner">
        {props.moveCount ? (
          <p className="move-count">{props.moveCount}</p>
        ) : (
          <Icon icon={TYPE_TO_ICON[props.type]} />
        )}
      </div>
    </div>
  )
}

ChessPiece.propTypes = {
  type: PropTypes.string,
  isBlack: PropTypes.bool,
  moveCount: PropTypes.number,
}

export default ChessPiece
