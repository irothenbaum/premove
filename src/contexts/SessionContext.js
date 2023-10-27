import {contextFactory} from './shared'
const SESSION_CACHE_KEY = 'premove-session'

/**
 * @typedef {Object} SessionContextData
 * @property {Object<string, DailyProgress>} progress // keyed by date string
 */

/**
 * @typedef {Object} DailyProgress
 * @property {GameProgress} easy
 * @property {GameProgress} moderate
 * @property {GameProgress} hard
 *
 */

/**
 * @typedef {Object} GameProgress
 * @property {number} attempts
 * @property {boolean} solved
 * @property {Array<Square>} moves
 */

export const DefaultSession = {
  progress: {},
}

const [SessionContext, HydratedSession, flushSession] = contextFactory(
  DefaultSession,
  SESSION_CACHE_KEY,
)

export {HydratedSession, flushSession}

export default SessionContext
