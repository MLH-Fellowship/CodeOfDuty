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
  const user = await request(app).get("/fetchSprints?user=vrushti-mody");
  expect(user).toBeTruthy();
  done();
});

it("Should return all sprints (Top 10)", async (done) => {
  // Sends request...
  const user = await request(app).get("/fetchAllSprints");
  expect(user).toBeTruthy();
  done();
});

afterAll(async (done) => {
  await mongoose.disconnect();
  done();
});
