import mongoose from 'mongoose'
import mongodb from 'mongodb'
import config from '~/config'
import logger from '~/services/logger'
import { ApiException } from '~/exceptions'

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  if (!(err instanceof ApiException) || err.status === 500) {
    logger.error(err)
  }
  apiResponse(res, null, [err])
}

export const errorToJson = e => {
  let error
  if (e instanceof ApiException) {
    error = e.toJSON()
  } else if (
    e instanceof mongoose.Error.ValidationError ||
    e instanceof mongodb.MongoError
  ) {
    let { name, message } = e
    error = {
      name,
      message,
      status: 400
    }
  } else {
    // obscure other errors for security reasons
    error = {
      name: 'Error'
      , status: 500
      , message: 'Server Error'
    }
  }

  if (config.isDev) {
    // include a stack trace on development
    return { ...error, stack: e.stack }
  }
}

// standardize responses
export const apiResponse = (res, data = {}, errors = []) => {
  errors = errors.map(errorToJson)

  // use the highest status
  const status = errors.reduce((s, e) => Math.max(s, e.status), 0)
  res.status(status || 200)

  if ( data === null ){
    data = {}
  }

  res.send({
    data,
    errors
  })
}
