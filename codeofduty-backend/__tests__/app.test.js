const request = require("supertest");
const app = require("../app");

describe("GET / ", () => {
    test("Hello World test", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("hello world!")
    });
});

describe("GET /authenticate ", () => {
  test("fails with no code", async () => {
    const response = await request(app).get("/authenticate");
    expect(response.statusCode).toBe(400);
<<<<<<< HEAD
    expect(response.body.message).toBe('Error: no code')
=======
    expect(response.body.message).toBe("Error: no code")
>>>>>>> 0255fd13147d255c044f81dea886adc8edf9751d
  });
});
