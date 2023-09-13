const { Pool } = require('pg')
const databaseData = require('./databaseData')

const databaseConnection = new Pool(databaseData)

module.exports = databaseConnection