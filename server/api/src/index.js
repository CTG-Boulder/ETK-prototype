import express from 'express'
import logger from '~/services/logger'
import pinoHttp from 'pino-http'
// const secrets = require('@/secrets')
import api from '~/routes/api.js'

// Constants
const PORT = 8000
const HOST = '0.0.0.0'

// App
const app = express()
app.use(pinoHttp({ logger }))
app.use('/api', api)
app.listen(PORT, HOST)
logger.info(`Running on http://${HOST}:${PORT}`)
