const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const env = require("./config/env");
const errorHandler = require("./middleware/errorMiddleware");
const { ensureAdminUser } = require("./services/bootstrapService");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.clientUrls.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed."));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
    disclaimer: "Not a medical diagnosis tool."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  await ensureAdminUser();
  app.listen(env.port, () => {
    console.log(`Backend server running on port ${env.port}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start backend:", error);
    process.exit(1);
  });
}

module.exports = { app, startServer };
