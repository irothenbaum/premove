import {contextFactory} from './shared'
const SESSION_CACHE_KEY = 'premove-session'

export const DefaultSession = {
  progress: {},
  hasReadRules: false,
}

const [SessionContext, HydratedSession, flushSession] = contextFactory(
  DefaultSession,
  SESSION_CACHE_KEY,
)

export {HydratedSession, flushSession}

export default SessionContext
