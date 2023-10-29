/**
 * @typedef {Object} Square
 * @property {number} row (0-indexed)
 * @property {number} column (0-indexed)
 * @property {boolean?} isBlack
 */

/**
 * @typedef {Square} Piece
 * @property {string} id
 * @property {string} type
 * @property {boolean?} isMovable
 * @property {number?} startingMoveDelay
 * @property {number?} currentMoveDelay
 */

/**
 * @typedef {Object} SessionContextData
 * @property {Object<string, DailyProgress>} progress // keyed by date string
 * @property {Object<string, SeriesProgress>} series // keyed by seed
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

/**
 * @typedef {Object} SeriesProgress
 * @property {number} level
 * @property {number} score
 * @property {number} seed
 */
