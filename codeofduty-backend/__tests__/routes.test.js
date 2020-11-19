const mongoose = require("mongoose");
require("dotenv").config();
const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  const uri = process.env.ATLAS_URI;
  await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
});

it("Should return sprints of a user", async () => {
  // Sends request...
  const user = await request(app).get("/fetchSprints?user=vrushti-mody");
  expect(user).toBeTruthy();
});

it("Should return all sprints (Top 10)", async () => {
  // Sends request...
  const user = await request(app).get("/fetchAllSprints");
  expect(user).toBeTruthy();
});
