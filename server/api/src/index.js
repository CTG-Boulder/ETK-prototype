const express = require( 'express' )
const secrets = require( './secrets' )
// Constants
const PORT = 8000
const HOST = '0.0.0.0'

async function testDb(){
  const neo4j = require('neo4j-driver')
  const driver = neo4j.driver(
    `bolt://neo4j:${process.env.NEO4J_PORT}`
    , neo4j.auth.basic('v303', '')
  )
  const session = driver.session()
  const personName = 'Alice'

  try {
    const result = await session.run(
      'CREATE (a:Person {name: $name}) RETURN a',
      { name: personName }
    )

    // const singleRecord = result.records[0]
    // const node = singleRecord.get(0)

    return result.records
  } finally {
    await session.close()
    // on application exit:
    await driver.close()
  }
}

// App
const app = express()
app.get('/', (req, res, next) => {
  testDb().then(name => {
    res.json({
      name
    })
  }, next)
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
