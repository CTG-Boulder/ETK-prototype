const mongoose = require('mongoose')
const user = process.env.MONGO_INITDB_ROOT_USERNAME
const pass = process.env.MONGO_INITDB_ROOT_PASSWORD
mongoose.connect(`mongodb://${user}:${pass}@mongodb:27017`, {
  useNewUrlParser: true
  , useUnifiedTopology: true
})

module.exports = mongoose

