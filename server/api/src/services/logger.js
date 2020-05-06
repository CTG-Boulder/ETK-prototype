import pino from 'pino'
import config from '~/config'

// basic logger
const logger = pino({
  level: config.logLevel
})

process.on('uncaughtException', pino.final(logger, (err, finalLogger) => {
  finalLogger.error(err, 'uncaughtException')
  process.exit(1)
}))

process.on('unhandledRejection', pino.final(logger, (err, finalLogger) => {
  finalLogger.error(err, 'unhandledRejection')
  process.exit(1)
}))

export default logger
