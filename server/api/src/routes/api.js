import config from '~/config'
import logger from '~/services/logger'
import ApiException from '~/exceptions/api-exception'
import TraceEvent from '~/models/trace-event'
import Router from 'express-promise-router'
const route = new Router()

// standardize responses
const apiResponse = (res, data = {}, errors = []) => {
  errors = errors.map(e => {
    if (e instanceof ApiException){
      if (config.isDev){
        // include a stack trace on development
        return { ...e.toJSON(), stack: e.stack }
      }
      return e.toJSON()
    } else {
      if (config.isDev) {
        // include a stack trace on development
        return {
          name: 'Error'
          , message: 'Server Error'
          , status: 500
          , stack: e.stack
        }
      }
      // obscure other errors for security reasons
      return {
        name: 'Error'
        , status: 500
        , message: 'Server Error'
      }
    }
  })

  // use the highest status
  const status = errors.reduce((s, e) => Math.max(s, e.status), 0)
  res.status(status || 200)

  res.send({
    data,
    errors
  })
}

const HELLO = {
  name: 'ETK Tracing Api'
  , version: '0.1'
}

route.get('/', async (req, res, next) => res.json(HELLO))

route.get('/events', async (req, res, next) => {
  let docs = await TraceEvent.fetchSince(req.query.since)
  apiResponse(res, docs)
})

// Error handler
route.use((err, req, res, next) => {
  if (!(err instanceof ApiException) || err.status === 500){
    logger.error(err)
  }
  apiResponse(res, null, [err])
})

export default route
