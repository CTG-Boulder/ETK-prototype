import mongoose from '~/services/mongoose'
import { encodeKeys } from '~/services/key-encoder'
import { InvalidRequestException } from '../../exceptions'
import { isValidHex } from './positive-key.helpers'

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
  static fetchEncodedKeysSince({ updatedAt }){
    return this.find({
        updatedAt: { $gte: updatedAt }
      }).select('clientKey')
      .then(docs => encodeKeys(docs.map(doc => doc.clientKey)))
  }

  static createFromList( positives ){
    if (!positives || !positives.length) {
      throw new InvalidRequestException('No positives provided', 400)
    }

    return this.create(positives)
  }
})

const model = mongoose.model('PositiveKey', schema)
export default model
