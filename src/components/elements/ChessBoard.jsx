import React, {memo, useCallback, useEffect, useRef, useState} from 'react'
import './ChessBoard.scss'
import {constructClassString} from '../../utilities'
import PropTypes from 'prop-types'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import {BOARD_SIZE, isSameSquare} from '../../constants/chess'

// --------------------------------------------------------------------------------

function Square(props) {
  return (
    <div
      className={constructClassString('chess-board-square', {
        black: props.isBlack,
        bounce: props.bounce,
      })}
      style={props.style}>
      <div className="chess-board-square-depth" />
      <div className="chess-board-square-coords">{props.label}</div>
    </div>
  )
}

Square.propTypes = {
  label: PropTypes.string,
  isBlack: PropTypes.bool,
  bounce: PropTypes.bool,
  style: PropTypes.object,
}

// --------------------------------------------------------------------------------

function ChessBoard(props) {
  // by dividing width by number of pieces we determine the percentage width/height of each square to the board
  const relativeDimensionRatio = Math.round(10000 / props.dimension) / 100
  const relativeDimensionPercentage = `${relativeDimensionRatio}%`
  const [interactedSquares, setInteractedSquares] = useState({})
  const {setTimer} = useDoOnceTimer()

  const handleClickSquare = useCallback(
    square => {
      // const squareKey = getSquareKey(square)
      // setInteractedSquares(s => ({...s, [squareKey]: true}))
      // setTimer(
      //   squareKey,
      //   () => {
      //     setInteractedSquares(s => {
      //       const newSquares = {...s}
      //       delete newSquares[squareKey]
      //       return newSquares
      //     })
      //   },
      //   500,
      // )
      if (typeof props.onClickSquare === 'function') {
        props.onClickSquare(square)
      }
    },
    [props.onClickSquare],
  )

  const handleHoverSquare = useCallback(
    square => {
      if (typeof props.onHoverSquare === 'function') {
        props.onHoverSquare(square)
      }
    },
    [props.onHoverSquare],
  )

  return (
    <div className={constructClassString('chess-board', props.className)}>
      {Array(props.dimension)
        .fill(null)
        .map((_, row) => {
          return (
            <div key={`${row}-row`} className="chess-board-row">
              {Array(props.dimension)
                .fill(null)
                .map((_, column) => {
                  const squareKey = getSquareKey({row, column})
                  const firstColumn = column === 0
                  const lastRow = row === props.dimension - 1
                  let label = ''
                  if (lastRow) {
                    label = String.fromCharCode(65 + column)
                  }
                  if (firstColumn) {
                    label += props.dimension - row
                  }
                  return (
                    <Square
                      key={`${squareKey}-square`}
                      isBlack={(row + column) % 2 === 1}
                      bounce={interactedSquares[squareKey]}
                      style={{paddingTop: relativeDimensionPercentage}}
                      label={label}
                    />
                  )
                })}
            </div>
          )
        })}
      <div className="chess-board-pieces-container">
        {props.pieces.map(piece => {
          return (
            <div
              className="chess-board-piece-container"
              key={piece.id}
              style={{
                top: `${relativeDimensionRatio * piece.row}%`,
                left: `${relativeDimensionRatio * piece.column}%`,
                width: relativeDimensionPercentage,
                height: relativeDimensionPercentage,
              }}>
              {props.renderPiece(piece)}
            </div>
          )
        })}
      </div>

      <BoardEventListener
        dimension={props.dimension}
        onClickSquare={handleClickSquare}
        onHoverSquare={handleHoverSquare}
      />
    </div>
  )
}

ChessBoard.propTypes = {
  renderPiece: PropTypes.func.isRequired,
  dimension: PropTypes.number,
  pieces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      isBlack: PropTypes.bool,
      isMovable: PropTypes.bool,
    }),
  ),
  onClickSquare: PropTypes.func,
  onPlacePiece: PropTypes.func,
  onHoverSquare: PropTypes.func,
}

ChessBoard.defaultProps = {
  dimension: BOARD_SIZE,
  pieces: [],
}

export default ChessBoard

// --------------------------------------------------------------------------------

const BoardEventListener = memo(props => {
  const squareSize = useRef(0)
  const boardRef = useRef(null)
  const lastHoveredSquare = useRef(null)

  const handlePress = e => {
    const thisSquare = getSquarePosition(e, squareSize.current)
    if (typeof props.onClickSquare === 'function') {
      props.onClickSquare(thisSquare)
    }
  }

  const handleMove = e => {
    const thisSquare = getSquarePosition(e, squareSize.current)
    if (
      !lastHoveredSquare.current ||
      !isSameSquare(lastHoveredSquare.current, thisSquare)
    ) {
      lastHoveredSquare.current = thisSquare
      if (typeof props.onHoverSquare === 'function') {
        props.onHoverSquare(lastHoveredSquare.current)
      }
    }
  }

  useEffect(() => {
    if (!boardRef.current) {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      squareSize.current = boardRef.current.clientWidth / props.dimension
    })
    resizeObserver.observe(boardRef.current)

    return () => resizeObserver.disconnect()
  }, [props.dimension])

  return (
    <div
      className="chess-board-click-listener"
      onClick={handlePress}
      onMouseMove={handleMove}
      ref={boardRef}
    />
  )
})

BoardEventListener.propTypes = {
  onClickSquare: PropTypes.func,
  dimension: PropTypes.number,
}

// --------------------------------------------------------------------------------
// UTILITY FUNCTIONS

/**
 * @param {*} e
 * @return {{x: number, y: number}}
 */
function getRelativePosition(e) {
  return {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  }
}

/**
 * @param {*} e
 * @param {number} squareSize
 * @return {Square}
 */
function getSquarePosition(e, squareSize) {
  const {x, y} = getRelativePosition(e)
  return {
    row: Math.floor(y / squareSize),
    column: Math.floor(x / squareSize),
  }
}

/**
 * @param {Square} s
 * @return {string}
 */
function getSquareKey(s) {
  return `${s.row}-${s.column}`
}
