import config from '~/config'
import logger from '~/services/logger'
import ApiException from '~/exceptions/api-exception'

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  if (!(err instanceof ApiException) || err.status === 500) {
    logger.error(err)
  }
  apiResponse(res, null, [err])
}

export const errorToJson = e => {
  if (e instanceof ApiException) {
    if (config.isDev) {
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
}

// standardize responses
export const apiResponse = (res, data = {}, errors = []) => {
  errors = errors.map(errorToJson)

  // use the highest status
  const status = errors.reduce((s, e) => Math.max(s, e.status), 0)
  res.status(status || 200)

  res.send({
    data,
    errors
  })
}
