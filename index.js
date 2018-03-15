const express = require('express')

const app = express()
const bodyParser = require('body-parser')

const morgan = require('morgan')

const config = require('config')

const router = require('./routes')

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(config.get('test.DBHost'))
}
if (process.env.NODE_ENV === 'development') {
  mongoose.connect(config.get('dev.DBHost'))
}

mongoose.connection.on('error', function () {
  console.log('Could not connect to the database. Exiting now...')
  process.exit()
})

mongoose.connection.once('open', function () {
  console.log('Successfully connected to the database')
})
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
const port = process.env.PORT || 8080

app.use('/api', router)

app.listen(port)

console.log('App is running on ', port)
module.exports = app
