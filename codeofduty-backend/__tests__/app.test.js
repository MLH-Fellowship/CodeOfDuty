const request = require('supertest');
const app = require('../app');

describe("GET / ", () => {
    test("Hello World test", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('hello world!')
    });
});