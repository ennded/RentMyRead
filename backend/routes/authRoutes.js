const express = express();
const { generateToken } = require("../config/jwt");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if(role==='admin' )
});
