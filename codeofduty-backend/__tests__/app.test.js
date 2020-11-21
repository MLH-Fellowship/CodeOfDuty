const request = require("supertest");
const app = require("../app");

describe("GET / ", () => {
  test("Hello World test", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("hello world!");
  });
});

describe("GET /authenticate ", () => {
  test("fails with no code", async () => {
    const response = await request(app).get("/authenticate");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Error: no code");
  });
});

describe("GET /fetchUserRepos", () => {
  test("fails with no access token", async () => {
    const response = await request(app).get("/fetchUserRepos");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Not authorized");
  });
});

describe("GET /fetchRepoMilestones", () => {
  test("fails with no repo", async () => {
    const response = await request(app).get("/fetchRepoMilestones");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("No repository selected");
  });
  test("fails with no access token", async () => {
    const response = await request(app).get("/fetchRepoMilestones?repo=test");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Not authorized");
  });
});
