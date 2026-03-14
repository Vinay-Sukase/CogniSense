process.env.JWT_SECRET = "test-secret";
process.env.MONGODB_URI = "mongodb://localhost/test";

jest.mock("../services/mlService", () => ({
  predictCognitiveState: jest.fn().mockResolvedValue({
    label: "Moderate Load",
    model: "mock-model",
    probabilities: {}
  })
}));

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app } = require("../server");
const User = require("../models/User");
const Session = require("../models/Session");

let mongoServer;
let token;
let sessionId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const signupResponse = await request(app).post("/api/auth/signup").send({
    name: "Delete Admin",
    email: "admin-delete@example.com",
    password: "Password123"
  });

  const adminUser = await User.findOne({ email: "admin-delete@example.com" });
  adminUser.role = "admin";
  await adminUser.save();

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: "admin-delete@example.com",
    password: "Password123"
  });

  token = loginResponse.body.token;

  const sessionResponse = await request(app)
    .post("/api/sessions")
    .set("Authorization", `Bearer ${token}`)
    .send({
      testMetrics: {
        reaction_time_mean: 430,
        reaction_time_variance: 19,
        missed_clicks: 1,
        nback_accuracy: 75,
        nback_false_positives: 2,
        nback_response_time: 600,
        memory_span: 6,
        recall_accuracy: 78,
        reverse_recall_accuracy: 66,
        reading_accuracy: 81,
        reading_time: 90,
        hesitation_count: 2,
        stroop_response_time: 710,
        stroop_interference_score: 40
      },
      questionnaireAnswers: [3, 3, 4, 3, 4, 4, 2, 3, 4, 3, 2, 3]
    });

  sessionId = sessionResponse.body.session.session_id;
});

afterAll(async () => {
  await User.deleteMany({});
  await Session.deleteMany({});
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Delete session API", () => {
  it("deletes a saved session for an authenticated admin", async () => {
    const response = await request(app)
      .delete(`/api/admin/sessions/${sessionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/deleted/i);
  });
});
