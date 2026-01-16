// backend/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 🔴 disable caching for API
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use("/auth", require("./routes/auth"));
app.use("/posters", require("./routes/posters"));

// Mount routers (do not require index.js here)
app.use("/auth", require("./routes/auth"));
app.use("/chatbot", require("./routes/chatbot"));
app.use("/posters", require("./routes/posters"));
app.use("/ml", require("./routes/ml"));

// Health route
app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;