const mongoose = require('../services/mongoose')

const EncounterSchema = new mongoose.Schema({
  clientId: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Encounter', EncounterSchema)
