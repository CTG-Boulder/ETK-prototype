const Encounter = require('@/models/encounter')
const Router = require('express-promise-router')
const route = new Router()

route.get('/', async (req, res, next) => {
  let rnd = Math.random() * 1000 | 0
  await Encounter.create({ clientId: `${rnd}` })
  let doc = await Encounter.findOne({ clientId: `${rnd}` })
  res.json(doc.toObject())
})

module.exports = route
