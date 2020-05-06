import TraceEvent from '~/models/trace-event'
import Router from 'express-promise-router'
import bodyParser from 'body-parser'
import { errorHandler, apiResponse } from './helpers'
const route = new Router()

const HELLO = {
  name: 'ETK Tracing Api'
  , version: '0.1'
}

// this must be first
route.use(bodyParser.json())

route.get('/', async (req, res) => res.json(HELLO))

route.get('/events', async (req, res) => {
  let docs = await TraceEvent.fetchSince(req.query.since)
  apiResponse(res, docs)
})

route.put('/events', async (req, res) => {
  let results = await TraceEvent.createFromList(req.body.events)
  apiResponse(res, { count: results.length })
})

// this must be last
route.use(errorHandler)

export default route
