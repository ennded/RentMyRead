const express = require("express");
const { generateToken } = require("../config/jwt");
const User = require("../models/User");
const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Admin registration requires secret code (simplified)
  if (role === "admin" && req.body.secretCode !== "ADMIN_SECRET_123") {
    return res.status(400).json({ message: "Invalid admin secret code" });
  }

  try {
    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(400).json({ message: "User already exists" });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
router.get("/me", exports.protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
