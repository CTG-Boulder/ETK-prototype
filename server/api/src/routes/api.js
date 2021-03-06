import moment from 'moment'
import PositiveKey from '~/models/positive-key'
import { encodeKeysAndShuffle, getPrime } from '~/services/key-encoder'
import Router from 'express-promise-router'
import EncountersRoute from './encounters'
import bodyParser from 'body-parser'
import { InvalidRequestException } from '~/exceptions'
import { errorHandler, apiResponse } from './helpers'

const route = new Router()

const HELLO = {
  name: 'ETK Api'
  , version: '0.1'
}

// this must be first
route.use(bodyParser.json())

route.get('/', async (req, res) => res.json(HELLO))

route.get('/verify', async (req, res) => {
  apiResponse(res, {
    sharedPrime: getPrime()
  })
})

route.put('/verify', async (req, res) => {
  let q = req.query
  let keys = req.body.keys

  if (!keys || !keys.length){
    throw new InvalidRequestException('Must send keys in request body as "keys"')
  }

  let encounterIds = encodeKeysAndShuffle(keys)
  let updatedAt = q.updatedAt ? moment(q.updatedAt) : moment().subtract(14, 'days')
  let positiveKeys = await PositiveKey.fetchEncodedKeysSince({ updatedAt })
  apiResponse(res, {
    since: updatedAt,
    sharedPrime: getPrime(),
    positiveKeys,
    encounterIds
  })
})

route.post('/report', async (req, res) => {
  let results = await PositiveKey.createFromList(req.body.positives)
  apiResponse(res, { added: results.length })
})

route.use('/encounters', EncountersRoute)

// this must be last
route.use(errorHandler)

export default route
