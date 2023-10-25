import React from 'react'
import './Pawn.scss'
import {constructClassString} from '../../utilities'
import Icon, {PAWN} from '../utility/Icon'

function Pawn(props) {
  return (
    <div className={constructClassString('pawn', props.className)}>
      <Icon icon={PAWN} />
    </div>
  )
}

export default Pawn
