const request = require("supertest");
const app = require("../app");

describe("POST /sprints/create ", () => {
  test("fails with no repo", async () => {
    const response = await request(app)
      .post("/sprints/create")
      .send({ milestone: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Missing parameters");
  });
  test("fails with no milestone", async () => {
    const response = await request(app)
      .post("/sprints/create")
      .send({ repo: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Missing parameters");
  });
  test("fails with no access token", async () => {
    const response = await request(app)
      .post("/sprints/create")
      .send({ repo: "test" })
      .send({ milestone: "test" });
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Not authorized");
  });
});
