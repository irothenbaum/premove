import React from 'react'
import './HowToPlay.scss'
import ChessPiece from '../elements/ChessPiece'
import Icon, {CHECK} from '../utility/Icon'
import {PIECE_KNIGHT, PIECE_PAWN} from '../../constants/chess'

function HowToPlay(props) {
  return (
    <div className="how-to-play-container">
      <div className="how-to-play-inner">
        <h1>
          How to play <span>Premove</span>
        </h1>
        <div className="section">
          <h3>Pieces</h3>
          <ul>
            <li>
              <strong>You:</strong> <ChessPiece type={PIECE_KNIGHT} />
            </li>
            <li>
              <strong>Pawn:</strong>{' '}
              <ChessPiece type={PIECE_PAWN} isBlack={true} />
            </li>
            <li>
              <strong>Delayed pawn:</strong>{' '}
              <div>
                <ChessPiece noTooltip={true} moveCount={2} isBlack={true} />
                <br />
                <em>This pawn will wait 2 turns before moving</em>
              </div>
            </li>
          </ul>
        </div>

        <div className="section">
          <h3>Rules</h3>
          <ul>
            <li>
              The pawns will march straight down the board, they will not attack
              you and they cannot step over you nor other pawns.
            </li>
            <li>
              When a pawn reaches the 1st rank, it will become a Queen and you
              will lose if you do not immediately capture it on your next move.
            </li>
            <li>
              If any pawns remain after you've made all your moves, you will
              lose.
            </li>
          </ul>
        </div>
        <div className="section">
          <h3>How to play</h3>
          <p>
            You play as the Knight. You may make any move that a knight can make
            in a game of Chess. Your goal is capture all the pawns in as few
            moves as possible, but you must schedule (or premove) all your moves
            in advance. To schedule a move, simply click a legal square your
            knight can travel to. Once you're satisfied with the moves you've
            placed, you'll click the <Icon icon={CHECK} /> button to submit your
            solution. If after all your moves are played any pawns remain, or if
            any pawn reaches the 1st rank{' '}
            <strong>
              without being immediately captured on your next move
            </strong>
            , you lose. If you're able to capture all the pawns before they
            reach the 1st rank, you win!
          </p>
        </div>
      </div>
    </div>
  )
}

export default HowToPlay
