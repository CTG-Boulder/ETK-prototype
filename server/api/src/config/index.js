const env = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'

export default Object.freeze({
  env
  , isDev
  , logLevel: isDev ? 'trace' : 'info'
  , maxQuerySize: 100 // 100 documents at a time
  , CORSOriginsAccepted: process.env.CORS_ORIGINS_ACCEPTED ? process.env.CORS_ORIGINS_ACCEPTED.split(',') : []
})
