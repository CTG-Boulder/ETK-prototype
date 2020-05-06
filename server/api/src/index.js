import express from 'express'
// const secrets = require('@/secrets')
import api from '~/routes/api.js'

// Constants
const PORT = 8000
const HOST = '0.0.0.0'

// App
const app = express()
app.use('/api', api)
app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
