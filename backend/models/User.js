const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: email,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    require: true,
  },
  createdAt: {},
});
