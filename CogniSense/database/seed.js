require("dotenv").config({ path: require("path").join(__dirname, "../backend/.env") });

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../backend/config/db");
const User = require("../backend/models/User");
const Session = require("../backend/models/Session");

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Session.deleteMany({})]);

  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@12345", 12);
  const userPassword = await bcrypt.hash("Student@123", 12);

  const [admin, user] = await User.create([
    {
      name: "System Admin",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      passwordHash: adminPassword,
      role: "admin"
    },
    {
      name: "Demo Student",
      email: "student@example.com",
      passwordHash: userPassword,
      role: "user"
    }
  ]);

  await Session.create({
    session_id: "demo-session-001",
    user_id: user._id,
    test_metrics: {
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
    questionnaire_scores: {
      attention: 6,
      mental_fatigue: 7,
      cognitive_overload: 8,
      productivity_perception: 5,
      motivation: 7,
      anxiety_tendency: 5,
      total: 38,
      answers: [3, 3, 4, 3, 4, 4, 2, 3, 4, 3, 2, 3]
    },
    cognitive_load_score: 49,
    cognitive_load_classification: "Moderate Load",
    ml_prediction: {
      label: "Moderate Load",
      model: "seeded-baseline",
      probabilities: { low: 0.1, moderate: 0.7, high: 0.2 }
    },
    suggestions: [
      "Use a Pomodoro cycle with notifications disabled.",
      "Take a short break within the next 20 minutes."
    ]
  });

  console.log("Database seeded successfully.");
  console.log(`Admin: ${admin.email}`);
  console.log(`User: ${user.email}`);

  await mongoose.connection.close();
};

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
