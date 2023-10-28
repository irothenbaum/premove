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
        <div className="section pieces-container">
          <h3>Pieces</h3>
          <div className="piece-description">
            <ChessPiece type={PIECE_KNIGHT} />
            <strong>You</strong>
            <p>Follows normal Chess Knight rules</p>
          </div>
          <div className="piece-description">
            <ChessPiece type={PIECE_PAWN} isBlack={true} />
            <strong>Pawn</strong>
            <p>Moves downward but does not attack</p>
          </div>
          <div className="piece-description">
            <ChessPiece noTooltip={true} moveCount={2} isBlack={true} />
            <strong>Delayed Pawn</strong>
            <p>Waits 2 turns before each move</p>
          </div>
        </div>

        <div className="section">
          <h3>How to play</h3>
          <p>
            <span>PREMOVE</span> is a Chess puzzle where you must schedule all
            your moves in advance before they take effect.
          </p>
          <p>
            To schedule a move, simple click a legal square your knight can
            travel to. Once you're satisfied with the moves you've placed,
            you'll click the <Icon icon={CHECK} /> button to submit your
            solution
          </p>
        </div>

        <div className="section">
          <h3>Rules</h3>
          <ul>
            <li>You control the Knight. Pawns will advance down the board.</li>
            <li>
              Your Knight can make any legal chess move. Pawns will not attack
              and can be blocked by your Knight. Your must capture all the Pawns
              to win.
            </li>
            <li>
              It a Pawn reaches the 1st rank, it will become a Queen. Queens
              must be taken immediately on your next move or you lose.
            </li>
            <li>
              If any Pawns remain after you've made all your moves, you will
              lose.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HowToPlay
