import request from "supertest";
import express from "express";
import invalidRoutesHandlerMiddleware from "../src/middlewares/invalidRoutes.middleware.js";
import { NOT_FOUND_CODE } from "../src/config/statusCode.js";

describe("Invalid Routes Middleware", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(invalidRoutesHandlerMiddleware);
  });

  it("should return a 404 response for invalid routes", async () => {
    const response = await request(app).get("/invalid-route");

    expect(response.status).toBe(NOT_FOUND_CODE);
    expect(response.body).toEqual({
      success: false,
      msg: expect.stringContaining("Invalid path: /invalid-route"),
    });
  });
});
