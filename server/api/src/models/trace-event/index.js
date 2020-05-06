import mongoose from '~/services/mongoose'

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

schema.statics.fetchSince = function( date ){
  return this.find({})
}

export default mongoose.model('TraceEvent', schema)
