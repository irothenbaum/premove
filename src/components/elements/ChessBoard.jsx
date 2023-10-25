import React from 'react'
import './ChessBoard.scss'
import {constructClassString} from '../../utilities'
import PropTypes from 'prop-types'

function Square(props) {
  return (
    <div
      className={constructClassString('chess-board-square', {
        black: props.isBlack,
      })}
      style={props.style}
    />
  )
}

Square.propTypes = {
  isBlack: PropTypes.bool,
  style: PropTypes.object,
}

function ChessBoard(props) {
  const paddingTop = `${Math.round(100 / props.dimension)}%`

  return (
    <div className={constructClassString('chess-board', props.className)}>
      {Array(props.dimension)
        .fill(null)
        .map((_, i) => {
          return (
            <div key={`${i}-row`} className="chess-board-row">
              {Array(props.dimension)
                .fill(null)
                .map((_, j) => {
                  return (
                    <Square
                      key={`${i}-${j}-square`}
                      isBlack={(i + j) % 2 === 1}
                      style={{paddingTop: paddingTop}}
                    />
                  )
                })}
            </div>
          )
        })}
    </div>
  )
}

ChessBoard.propTypes = {
  dimension: PropTypes.number,
}

export default ChessBoard
