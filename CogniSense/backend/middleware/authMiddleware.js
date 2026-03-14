const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Invalid token user." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized access." });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden resource." });
  }

  next();
};

module.exports = { protect, authorize };

