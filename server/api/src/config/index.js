const env = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'

export default Object.freeze({
  env
  , isDev
  , logLevel: isDev ? 'trace' : 'info'
  , maxQuerySize: 100 // 100 documents at a time
})
