import mongoose from '~/services/mongoose.js'

const EncounterSchema = new mongoose.Schema({
  clientId: String
}, {
  timestamps: true
})

export default mongoose.model('Encounter', EncounterSchema)
