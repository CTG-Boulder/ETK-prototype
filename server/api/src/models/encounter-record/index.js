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
import { max } from 'moment'

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

  static hourlyAggregation(startDate, endDate, maxDistance){
    const IQR_CUTOFF = 50
    let aggr = this.aggregate().sort({ timestamp: +1 })

    if (startDate || endDate || maxDistance) {
      let match = {}
      if (startDate || endDate) {
        let tsq = {}
        if (startDate) {
          tsq['$gte'] = new Date(startDate)
        }
        if (endDate) {
          tsq['$lte'] = new Date(endDate)
        }
        match['timestamp'] = tsq
      }

      if (maxDistance) {
        let val = maxDistance * 300 + 50
        match['_meta.usound_data.left_iqr'] = { $lt: IQR_CUTOFF }
        match['_meta.usound_data.right_iqr'] = { $lt: IQR_CUTOFF }
        let $or = [{ ...match }, { ...match }]
        $or[0]['_meta.usound_data.left'] = { $lte: val }
        $or[1]['_meta.usound_data.right'] = { $lte: val }
        match = { $or }
      }

      aggr.match(match)
    }

    aggr
      .group({
        _id: { $dateToString: { format: '%Y-%m-%dT%H:00:00.000Z', date: "$timestamp" } },
        count: {
          $sum: 1
        }
      })

    return aggr
  }

  static async getStats(startDate, endDate, maxDistance){

    let results = await this.hourlyAggregation(startDate, endDate, maxDistance).group({
        _id: { $substr: ['$_id', 0, 10] },
        hourly: {
          $push: '$count'
        },
        daily: {
          $sum: 1
        }
      })
      .group({
        _id: '',
        perHour: {
          $push: '$hourly'
        },
        perDay: {
          $push: '$daily'
        }
      })
      .project({
        _id: false,
        perHour: {
          $reduce: {
            input: "$perHour",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }
        },
        daily: {
          max: {
            $max: '$perDay'
          },
          min: {
            $min: '$perDay'
          },
          mean: {
            $avg: '$perDay'
          },
          stdDev: {
            $stdDevPop: '$perDay'
          }
        }
      })
      .project({
        daily: true,
        hourly: {
          max: {
            $max: '$perHour'
          },
          min: {
            $min: '$perHour'
          },
          mean: {
            $avg: '$perHour'
          },
          stdDev: {
            $stdDevPop: '$perHour'
          }
        }
      })
      .exec()

    return results[0]
  }
})

const model = mongoose.model('EncounterRecord', schema)
model.syncIndexes()
export default model
