import moment from 'moment'
import _times from 'lodash/times'
import _sortBy from 'lodash/sortBy'
import EncounterRecord from '~/models/encounter-record'
// import { encodeKeysAndShuffle, getPrime } from '~/services/key-encoder'
import Router from 'express-promise-router'
import { InvalidRequestException } from '~/exceptions'
import { errorHandler, apiResponse, getQueryFilters } from '../helpers'

const route = new Router()

// ----
// most code in here is for debug/testing purposes
// ----
route.get('/debug', async (req, res) => {
  const queryFilters = getQueryFilters(req)
  let encounters = await EncounterRecord
    .find(queryFilters.filters, null, { sort: queryFilters.sortBy })
    .skip(queryFilters.startAt)
    .limit(queryFilters.pageSize)

  let count = await EncounterRecord
    .find(queryFilters.filters, null, { sort: queryFilters.sortBy })
    .count()

  res.header('X-Pages', Math.floor(count / queryFilters.pageSize))
  apiResponse(res, { encounters })
})

route.post('/debug', async (req, res) => {
  let records = req.body.encounters
  if (!records || !records.length){
    throw new InvalidRequestException("No encounters provided")
  }
  let encounters = await EncounterRecord.createFromList(records)
  apiResponse(res, {
    added: encounters.length
  })
})

route.get('/debug/stats', async (req, res) => {
  let stats = await EncounterRecord.getStats(
    req.query.min_timestamp,
    req.query.max_timestamp,
    req.query.max_distance
  )
  apiResponse(res, {
    stats
  })
})

route.get('/debug/hourly', async (req, res) => {
  let perHour = await EncounterRecord.hourlyAggregation(
    req.query.min_timestamp,
    req.query.max_timestamp,
    req.query.max_distance
  ).exec()

  apiResponse(res, {
    perHour
  })
})

// debug helper
route.get('/debug/purge', async (req, res) => {
  const queryFilters = getQueryFilters(req)
  if (req.query.purge) {
    // strip out the purge request
    delete queryFilters.filters.purge
    await EncounterRecord.deleteMany(queryFilters.filters)
  }

  apiResponse(res, {
    ok: 1
  })
})
route.post('/debug/mock', async (req, res) => {
  if (req.query.purge){
    await EncounterRecord.remove({})
  }
  let records = generateDummyEncounters(300)
  let encounters = await EncounterRecord.createFromList(records)
  apiResponse(res, {
    added: encounters.length
  })
})

function generateDummyEncounters(count){
  return _times(count, g => {
    let e = {
      clientKey: _times(32, n => ('00' + (Math.round(128 * Math.sin(g * n) + 128)).toString(16)).slice(-2)).join(''),
      status: 'NONE',
      timestamp: moment('2020-05-01T00:00:00Z').add(Math.floor(Math.sin(g / 10) * 48), 'hours').toISOString(),
      createdAt: moment('2020-08-01T00:00:00Z').toISOString(),
      updatedAt: moment('2020-08-01T00:00:00Z').toISOString(),
      _meta: {
        mac: _times(6, n => ('00' + (Math.round(128 * Math.sin(g * n) + 128)).toString(16)).slice(-2)).join(''),
        rssi_values: _times(12, n => Math.round(128 * Math.sin(g * n) + 128)),
        usound_data: {
          left: Math.round(400 * Math.sin(g * 20) + 400),
          left_iqr: Math.round(25 * Math.sin(g * 10) + 25),
          right: Math.round(400 * Math.sin(g * 30) + 400),
          right_iqr: Math.round(25 * Math.sin(g * 50) + 25),
          n: 0
        }
      }
    }
    return e
  })
}

// Returns dummy data
route.get('/dummy', async (req, res) => {
  const count = 300
  const queryFilters = getQueryFilters(req)

  let encounters = generateDummyEncounters(count)
  encounters = _sortBy(encounters, 'timestamp')
  encounters = encounters.slice(queryFilters.startAt, queryFilters.startAt + queryFilters.pageSize)
  res.header('X-Pages', Math.floor(count / queryFilters.pageSize))
  apiResponse(res, { encounters })
})

// this must be last
route.use(errorHandler)

export default route
