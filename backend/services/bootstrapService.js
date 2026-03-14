const bcrypt = require("bcryptjs");
const env = require("../config/env");
const User = require("../models/User");

const ensureAdminUser = async () => {
  if (!env.adminEmail || !env.adminPassword) {
    return;
  }

  const existingAdmin = await User.findOne({ email: env.adminEmail.toLowerCase() });
  if (existingAdmin) {
    return;
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await User.create({
    name: "Platform Admin",
    email: env.adminEmail,
    passwordHash,
    role: "admin"
  });
};

module.exports = { ensureAdminUser };
