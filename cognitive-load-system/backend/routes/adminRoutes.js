const express = require("express");
const {
  getDashboardStats,
  getAllUsers,
  getAllSessions,
  deleteUser,
  exportDataset,
  deleteSession
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/sessions", getAllSessions);
router.get("/export", exportDataset);
router.delete("/users/:userId", deleteUser);
router.delete("/sessions/:sessionId", deleteSession);

module.exports = router;
