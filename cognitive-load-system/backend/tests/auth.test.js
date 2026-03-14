process.env.JWT_SECRET = "test-secret";
process.env.MONGODB_URI = "mongodb://localhost/test";

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app } = require("../server");
const User = require("../models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Auth API", () => {
  it("creates a user account", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "test@example.com",
      password: "Password123"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe("test@example.com");
  });

  it("logs in an existing user", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Login User",
      email: "login@example.com",
      password: "Password123"
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "Password123"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.role).toBe("user");
  });
});

