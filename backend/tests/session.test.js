process.env.JWT_SECRET = "test-secret";
process.env.MONGODB_URI = "mongodb://localhost/test";

jest.mock("../services/mlService", () => ({
  predictCognitiveState: jest.fn().mockResolvedValue({
    label: "Moderate Load",
    model: "mock-model",
    probabilities: { "Moderate Load": 0.8 }
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

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const signupResponse = await request(app).post("/api/auth/signup").send({
    name: "Session User",
    email: "session@example.com",
    password: "Password123"
  });

  token = signupResponse.body.token;
});

afterEach(async () => {
  await Session.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Session API", () => {
  it("creates an assessment session", async () => {
    const response = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        testMetrics: {
          reaction_time_mean: 420,
          reaction_time_variance: 18,
          missed_clicks: 1,
          nback_accuracy: 74,
          nback_false_positives: 2,
          nback_response_time: 610,
          memory_span: 6,
          recall_accuracy: 78,
          reverse_recall_accuracy: 65,
          reading_accuracy: 80,
          reading_time: 95,
          hesitation_count: 3,
          stroop_response_time: 720,
          stroop_interference_score: 42
        },
        questionnaireAnswers: [3, 3, 4, 3, 4, 4, 2, 3, 4, 3, 2, 3]
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.session.session_id).toBeDefined();
    expect(response.body.scoring.score).toBeGreaterThanOrEqual(0);
    expect(response.body.mlPrediction.label).toBe("Moderate Load");
  });
});
