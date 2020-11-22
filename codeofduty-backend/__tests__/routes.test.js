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

test("Should return sprints of a user", async (done) => {
  // Sends request...
  const userSprints = await request(app).get(
    "/fetchUserSprints?user=vrushti-mody",
  );
  expect(userSprints).toBeTruthy();
  done();
});

test("Should return all sprints (Top 10)", async (done) => {
  // Sends request...
  const topSprints = await request(app).get("/fetchGlobalSprints");
  expect(topSprints).toBeTruthy();
  done();
});

it("Fetch Existing Repo", async (done) => {
  const response = await request(app).get("/repo/MLH-Fellowship/AmongUps");
  expect(response.statusCode).toBe(200);
  done();
});

it("Give Error for Non-Existing Repo", async (done) => {
  const response = await request(app).get("/repo/test/nkajvka");
  expect(response.statusCode).toBe(404);
  done();
});

it("Fetch Existing Sprint", async (done) => {
  const response = await request(app).get("/sprint/994a1832cb");
  expect(response.statusCode).toBe(200);
  done();
});

it("Give Error for Non-Existing Repo", async (done) => {
  const response = await request(app).get("/sprint/alnclas");
  expect(response.statusCode).toBe(404);
  done();
});

afterAll(async (done) => {
  await mongoose.disconnect();
  done();
});
