const express = require("express");
const { body } = require("express-validator");
const { signup, login, profile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters.")
  ],
  signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required.")
  ],
  login
);

router.get("/me", protect, profile);

module.exports = router;
