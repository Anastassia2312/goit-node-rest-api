import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../model/usersModel";
import "dotenv/config";

const DB_URI = process.env.DB_URI;

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_URI);
  });
  afterAll(async () => {
    await mongoose.disconnect(DB_URI);
  });

  it("response should have 200 status code", async () => {
    await supertest(app).post("/users/register").send({
      email: "User228@mail.com",
      password: "123456",
    });
    const response = await supertest(app).post("/users/login").send({
      email: "User228@mail.com",
      password: "123456",
    });
    expect(response.statusCode).toBe(200);
  });

  it("response should contain token", async () => {
    await supertest(app).post("/users/register").send({
      email: "User3@mail.com",
      password: "123456",
    });
    const response = await supertest(app).post("/users/login").send({
      email: "User3@mail.com",
      password: "123456",
    });
    expect(response.body.token).toBeDefined();
  });

  it("response should contain email and password with type String", async () => {
    await supertest(app).post("/users/register").send({
      email: "User5@mail.com",
      password: "123456",
    });
    const response = await supertest(app).post("/users/login").send({
      email: "User5@mail.com",
      password: "123456",
    });

    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );
  });
});
