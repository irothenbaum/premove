import React, {forwardRef} from 'react'
import './ChessPiece.scss'
import PropTypes from 'prop-types'
import {PIECE_KNIGHT, PIECE_PAWN, PIECE_QUEEN} from '../../constants/chess'
import {constructClassString} from '../../utilities'
import Icon, {PAWN, KNIGHT, QUEEN} from '../utility/Icon'
import ToolTip from '../utility/ToolTip'

const TYPE_TO_ICON = {
  [PIECE_PAWN]: PAWN,
  [PIECE_KNIGHT]: KNIGHT,
  [PIECE_QUEEN]: QUEEN,
}

const ChessPiece = forwardRef(function ChessPiece(props, ref) {
  const piece = (
    <div
      className={constructClassString('chess-piece', {black: props.isBlack})}
      ref={ref}>
      <div className="chess-piece-inner">
        {props.moveCount ? (
          <p className="move-count">{props.moveCount}</p>
        ) : (
          <Icon icon={TYPE_TO_ICON[props.type]} />
        )}
      </div>
    </div>
  )

  return props.moveCount > 0 ? (
    <ToolTip
      className="chess-piece-tool-tip"
      label={getLabelFromMoveCount(props.moveCount)}
      isShown={props.isHovered}>
      {piece}
    </ToolTip>
  ) : (
    piece
  )
})

/**
 * @param {number?} moveCount
 * @return {string}
 */
function getLabelFromMoveCount(moveCount) {
  switch (moveCount) {
    case 1:
      return `This piece skips a turn before moving`

    default:
      return `This piece skips ${moveCount} turns before moving`
  }
}

ChessPiece.propTypes = {
  type: PropTypes.string,
  isBlack: PropTypes.bool,
  moveCount: PropTypes.number,
  isHovered: PropTypes.bool,
}

export default ChessPiece
