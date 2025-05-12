const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, // payload
    process.env.JWT_SECRET, // secret key used for signing
    { expiresIn: "30d" } // options (expirations belongs to payload)
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
