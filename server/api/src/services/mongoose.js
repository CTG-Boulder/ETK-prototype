const mongoose = require('mongoose')
mongoose.connect('mongodb://root:root@mongodb:27017', {
  useNewUrlParser: true
  , useUnifiedTopology: true
})

module.exports = mongoose

