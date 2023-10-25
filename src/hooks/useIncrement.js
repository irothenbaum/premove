import {useState} from 'react'

function useIncrement(startingValue) {
  const [value, setValue] = useState(startingValue)
  const change = (amount = 0) =>
    setValue(i => {
      const next = i + Math.round(amount)
      return next < 0 ? 0 : next
    })

  return {
    value,
    setValue,
    increment: (amount = 1) => change(amount),
    decrement: (amount = 1) => change(-amount),
    change: change,
  }
}

export default useIncrement
