require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const passport = require("passport");
require("./config/passport");

const app = express();

//middleware
app.use(helmet()); //security headers
app.use(cors()); // cross orgin resource sharing
app.use(express.json()); // body parser
app.use("/api/auth", authRoutes);
app.use(passport.initialize());

connectDB();

//test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is Running",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
