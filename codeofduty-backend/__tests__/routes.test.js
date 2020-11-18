const mongoose = require('mongoose')
const databaseName = 'test'

beforeAll(async () => {
    const uri = require('./config').ATLAS_URI+`${databaseName}`
  await mongoose.connect(url, { useNewUrlParser: true })
})