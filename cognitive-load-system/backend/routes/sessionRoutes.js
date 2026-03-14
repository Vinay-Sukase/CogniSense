const express = require("express");
const {
  createSession,
  getMySessions,
  getSessionById
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/", createSession);
router.get("/", getMySessions);
router.get("/:sessionId", getSessionById);

module.exports = router;
