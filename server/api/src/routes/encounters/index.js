import moment from 'moment'
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
    .find(queryFilters.filters)
    .skip(queryFilters.startAt)
    .limit(queryFilters.pageSize)

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

// this must be last
route.use(errorHandler)

export default route
