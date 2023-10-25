/**
 * @param {string|Object<string, boolean>} classes
 * @returns {string}
 */
export function constructClassString(...classes) {
  return classes
    .filter(o => !!o)
    .reduce((acc, curr) => {
      if (typeof curr === 'string') {
        acc.push(curr)
      } else if (typeof curr === 'object') {
        acc.push(
          ...Object.entries(curr || {})
            .filter(([key, value]) => !!value)
            .map(([key, value]) => key),
        )
      }

      return acc
    }, [])
    .join(' ')
}

/**
 * @param {number} timeMS
 * @returns {Array<number>}
 */
export function timeMSToParts(timeMS = 0) {
  const minutes = Math.floor(timeMS / 60000)
  const seconds = Math.floor((timeMS % 60000) / 1000)
  const milliseconds = Math.floor((timeMS % 1000) / 10)

  return [minutes, seconds, milliseconds]
}

/**
 * @param {number} minutes
 * @param {number?} seconds
 * @param {number?} milliseconds
 * @return {number}
 */
export function timePartsToMS(minutes, seconds = 0, milliseconds = 0) {
  return minutes * 60000 + seconds * 1000 + milliseconds * 10
}

/**
 * @param {string} string
 * @return {string}
 */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * @param {number?} length
 * @return {string}
 */
export function getRandomString(length = 30) {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join('')
}
