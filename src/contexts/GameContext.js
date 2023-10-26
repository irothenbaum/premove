import {contextFactor} from './shared'
const GAME_CACHE_KEY = 'premove-game'

/**
 * @typedef {Object} GameContextData
 * @property {number} level
 * @property {number} score
 * @property {number} seed
 */
export const DefaultGame = {
  level: 1,
  score: 0,
  seed: 0,
}

const [GameContext, HydratedGame, flushGame] = contextFactor(
  DefaultGame,
  GAME_CACHE_KEY,
)

export {HydratedGame, flushGame}

export default GameContext
