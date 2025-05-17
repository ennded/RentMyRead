const express = require("express");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const User = require("../models/User");
const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role, secretCode } = req.body;

  if (role === "admin" && secretCode !== process.env.ADMIN_SECRET) {
    return res.status(400).json({ message: "Invalid  admin secret code" });
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
  } catch (error) {
    res.status(400).json({ message: "User already exist" });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

module.exports = router;
