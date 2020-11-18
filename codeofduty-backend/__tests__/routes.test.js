const mongoose = require('mongoose')
const databaseName = 'test'

beforeAll(async () => {
    const uri = require('./config').ATLAS_URI+`${databaseName}`
  await mongoose.connect(url, { useNewUrlParser: true })
})

it('Should return sprints of a user', async done => {
    // Sends request...
    const res = await request.get('/fetchSprints/vrushti-mody')
    expect(res).toBeTruthy()
    done()
  })