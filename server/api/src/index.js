const express = require('express')
// const secrets = require('@/secrets')

// Constants
const PORT = 8000
const HOST = '0.0.0.0'

// App
const app = express()
app.use('/api', require('@/routes/api'))
app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
