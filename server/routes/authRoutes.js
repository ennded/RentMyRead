const express = require("express");
const { generateToken } = require("../config/jwt");
const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ----------------------------------
// ✅ Common Social Callback Function
// ----------------------------------
const socialCallback = (req, res) => {
  const token = generateToken(req.user._id, req.user.role);
  res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
};

// ----------------------------------
// ✅ Social Login Routes
// ----------------------------------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// ✅ Social Login Callback Routes
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  socialCallback
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  socialCallback
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  socialCallback
); // ✅ ADD THIS

// ----------------------------------
// ✅ Normal Auth Routes
// ----------------------------------

// @desc    Register user
// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

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
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
