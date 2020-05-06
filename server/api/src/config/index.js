const env = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'

export default Object.freeze({
  env
  , isDev
  , logLevel: isDev ? 'trace' : 'info'
})
