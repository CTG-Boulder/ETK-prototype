import mongoose from '~/services/mongoose'
import { InvalidRequestException } from '../../exceptions'

export const STATUS = {
  POSITIVE: "POSITIVE"
  , SUSPECTED: "SUSPECTED"
  , WITHDRAWN: "WITHDRAWN"
}

const schema = new mongoose.Schema({
  clientKey: {
    type: String
    , unique: true
    , required: true
  }
  , status: {
    type: String
    , enum: Object.keys(STATUS)
    , required: true
  }
  , signalStrength: {
    type: Number
    , required: true
  }
  , timestamp: {
    type: Date
    , required: true
  }
  , _meta: {}
}, {
  timestamps: true
})

schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
schema.index({ timestamp: 1 })

schema.loadClass(class {
  static fetchSince( date ){
    return this.find({})
  }

  static createFromList( events ){
    if (!events || !events.length) {
      throw new InvalidRequestException('No events provided', 400)
    }

    return this.create(events)
  }
})

export default mongoose.model('TraceEvent', schema)
