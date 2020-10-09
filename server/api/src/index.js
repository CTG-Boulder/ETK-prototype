import express from 'express'
import cors from 'cors'
import logger from '~/services/logger'
import pinoHttp from 'pino-http'
// const secrets = require('@/secrets')
import api from '~/routes/api.js'
import config from '~/config'

// Constants
const PORT = 8000
const HOST = '0.0.0.0'

// App
const app = express()
app.use(cors({
  origin: function(value, callback) {
    if (value === undefined || config.CORSOriginsAccepted.indexOf(value) !== -1) {
      callback(null, true)
    } else {
      console.log('rejected origin: ' + value)
      callback(null, false)
    }
  }
  , exposedHeaders: 'X-Pages'
}))
app.use(pinoHttp({ logger }))
app.use('/api', api)
app.listen(PORT, HOST)
logger.info(`Running on http://${HOST}:${PORT}`)
