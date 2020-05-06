
import TraceEvent from '~/models/trace-event'
import Router from 'express-promise-router'
import { errorHandler, apiResponse } from './helpers'
const route = new Router()

const HELLO = {
  name: 'ETK Tracing Api'
  , version: '0.1'
}

route.get('/', async (req, res, next) => res.json(HELLO))

route.get('/events', async (req, res, next) => {
  let docs = await TraceEvent.fetchSince(req.query.since)
  apiResponse(res, docs)
})

route.use(errorHandler)

export default route
