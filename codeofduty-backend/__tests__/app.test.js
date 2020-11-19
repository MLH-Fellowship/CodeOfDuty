const request = require('supertest');
const app = require('../app');

describe("GET / ", () => {
    test("Hello World test", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('hello world!')
    });
});

<<<<<<< HEAD
=======
describe("GET /repo ", () => {
  test("Repo Model Sample Test", async () => {
    const response = await request(app).get("/repo");
    expect(response.statusCode).toBe(200);
  });
});
>>>>>>> 2ac3dc1a4f37775068c36533cfbab13224191ed4
