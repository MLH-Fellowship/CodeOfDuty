const mongoose = require('mongoose')
require('dotenv').config()
const request =require('supertest');
const databaseName = 'test'
const app = require('../app')

beforeAll(async () => {
    const uri = process.env.ATLAS_URI+`${databaseName}`
  await mongoose.connect(uri, { useNewUrlParser: true })
})

it('Should return sprints of a user', async () => {
    // Sends request...
    const user= await request(app).get('/fetchSprints?user=vrushti-mody')
    
      expect(user).toBeTruthy()
      
     
   
  })