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

function ChessPiece({piece}) {
  return (
    <div
      className={constructClassString('chess-piece', {black: piece.isBlack})}>
      <Icon icon={TYPE_TO_ICON[piece.type]} />
    </div>
  )
}

ChessPiece.propTypes = {
  piece: PropTypes.shape({
    type: PropTypes.string,
    isBlack: PropTypes.bool,
  }),
}

export default ChessPiece
