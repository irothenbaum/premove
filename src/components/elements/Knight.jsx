import React from 'react'
import './Knight.scss'
import {constructClassString} from '../../utilities'
import Icon, {KNIGHT} from '../utility/Icon'

function Knight(props) {
  return (
    <div className={constructClassString('knight', props.className)}>
      <Icon icon={KNIGHT} />
    </div>
  )
}

export default Knight
