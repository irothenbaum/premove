import React from 'react'
import './PremoveControls.scss'
import PropTypes from 'prop-types'
import Button from '../utility/Button'
import Icon, {RESET, CHECK} from '../utility/Icon'
import ToolTip, {ANCHOR_BOTTOM} from '../utility/ToolTip'

function PremoveControls(props) {
  return (
    <div className="premove-controls">
      <div />
      <ToolTip label="Reset moves">
        <Button onClick={props.onReset} isSecondary={true}>
          <Icon icon={RESET} />
        </Button>
      </ToolTip>
      <div />
      <ToolTip label="Submit">
        <Button onClick={props.onSubmit} disabled={props.isDisabled}>
          <Icon icon={CHECK} />
        </Button>
      </ToolTip>
      <div />
    </div>
  )
}

PremoveControls.propTypes = {
  isDisabled: PropTypes.bool,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default PremoveControls
