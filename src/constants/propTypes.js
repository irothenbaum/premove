import PropTypes from 'prop-types'

export const inputProps = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  className: PropTypes.string,
}
