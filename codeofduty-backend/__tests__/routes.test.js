const mongoose = require("mongoose");
require("dotenv").config();
const request = require("supertest");
const app = require("../app");

beforeAll(async (done) => {
  const uri = process.env.ATLAS_URI;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  done();
});

it("Should return sprints of a user", async (done) => {
  // Sends request...
  const userSprints = await request(app).get("/fetchUserSprints?user=vrushti-mody");
  expect(userSprints).toBeTruthy();
  done();
});

it("Should return all sprints (Top 10)", async (done) => {
  // Sends request...
  const topSprints = await request(app).get("/fetchGlobalSprints");
  expect(topSprints).toBeTruthy();
  expect(topSprints)
  done();
});

afterAll(async (done) => {
  await mongoose.disconnect();
  done();
});
