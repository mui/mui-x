import ciEnvironment from 'ci-info'

const isZeitNow = !!process.env.NOW_BUILDER

const envStack = process.env.STACK
const isHeroku =
    typeof envStack === 'string' && envStack.toLowerCase().includes('heroku')

export const isCI = isZeitNow || isHeroku || ciEnvironment.isCI
export const name = isZeitNow && 'ZEIT Now' || (isHeroku && 'Heroku' || ciEnvironment.name)
