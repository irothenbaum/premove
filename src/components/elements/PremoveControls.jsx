import React from 'react'
import './PremoveControls.scss'
import PropTypes from 'prop-types'
import Button, {VARIANT_SECONDARY} from '../utility/Button'
import Icon, {RESET, CHECK} from '../utility/Icon'
import ToolTip, {ANCHOR_BOTTOM} from '../utility/ToolTip'

function PremoveControls(props) {
  return (
    <div className="premove-controls">
      <ToolTip label="Reset moves">
        <Button
          onClick={props.onReset}
          variant={VARIANT_SECONDARY}
          disabled={props.disableReset}>
          <Icon icon={RESET} />
        </Button>
      </ToolTip>
      <ToolTip label="Submit">
        <Button onClick={props.onSubmit} disabled={!props.hasMoves}>
          <Icon icon={CHECK} />
        </Button>
      </ToolTip>
    </div>
  )
}

PremoveControls.propTypes = {
  hasMoves: PropTypes.bool,
  disableReset: PropTypes.bool,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default PremoveControls
