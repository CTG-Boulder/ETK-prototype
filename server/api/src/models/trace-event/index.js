import mongoose from '~/services/mongoose'
import { InvalidRequestException } from '../../exceptions'
import { KeyEncoder } from '~/../native/index.node'

function isValidHex(v){
  return /[0-9a-f]+/.test(v)
}

const keyEncoder = new KeyEncoder()

function encodeKey(key) {
  return keyEncoder.encode(key)
}

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
    , validate( v ){
      return isValidHex(v)
    }
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
  static fetchEncodedKeysSince( date ){
    return this.find({ }).select('clientKey')
      .then(docs => docs.map(doc => encodeKey(doc.clientKey)))
  }

  static createFromList( events ){
    if (!events || !events.length) {
      throw new InvalidRequestException('No events provided', 400)
    }

    return this.create(events)
  }
})

const model = mongoose.model('TraceEvent', schema)
export default model
