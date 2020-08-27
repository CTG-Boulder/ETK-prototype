//----------------------------
// This stores any encounters
// Not just positive ones
// Meant for "encounter tracing"
//----------------------------
import _pick from 'lodash/pick'
import _differenceBy from 'lodash/differenceBy'
import mongoose from '~/services/mongoose'
// import { encodeKeysAndShuffle } from '~/services/key-encoder'
import { InvalidRequestException } from '../../exceptions'
import { isValidHex } from '~/util'

export const STATUS = {
  NONE: "NONE"
  , POSITIVE: "POSITIVE"
  , SUSPECTED: "SUSPECTED"
  , WITHDRAWN: "WITHDRAWN"
}

const schema = new mongoose.Schema({
  clientKey: {
    type: String
    , required: true
    , unique: false
    , validate(v) {
      return isValidHex(v)
    }
  }
  , status: {
    type: String
    , enum: Object.keys(STATUS)
    , required: true
    , default: STATUS.NONE
  }
  , timestamp: {
    type: Date
    , required: true
  }
  , _meta: {}
}, {
  timestamps: true
})

// unique combinations of key and timestamp
schema.index({ clientKey: 1, timestamp: 1 }, { unique: true });
schema.index({ createdAt: 1 })
schema.index({ updatedAt: 1 })
schema.index({ timestamp: 1 })

schema.loadClass(class {

  static async createFromList(records) {
    if (!records || !records.length) {
      throw new InvalidRequestException('No records provided', 400)
    }

    const $or = records.map(r => _pick(r, ['clientKey', 'timestamp']))
    let existing = await this.find({ $or })

    let newRecords = _differenceBy(records, existing, d => {
      let ts = new Date(d.timestamp)
      return d.clientKey + ' ' + ts
    })

    if (!newRecords || !newRecords.length){
      return []
    }

    return this.create(newRecords)
  }
})

const model = mongoose.model('EncounterRecord', schema)
model.syncIndexes()
export default model
