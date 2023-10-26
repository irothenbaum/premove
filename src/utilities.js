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
 * @param {string} string
 * @return {string}
 */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * @param {string} message
 * @return {Promise<string>}
 */
export async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message)

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * @param {string} seedStr
 * @return {Promise<Generator>} // next().value is a number between 0 and 99
 */
export async function randomGenerator(seedStr) {
  const sha = await sha256(seedStr)
  const b64Code = btoa(sha)

  function* generator() {
    let i = 0
    while (true) {
      const num = b64Code.charCodeAt(i % b64Code.length) % 100
      i++
      yield num
    }
  }

  return generator()
}
