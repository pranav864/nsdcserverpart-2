const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./backend/routes/authroute");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "frontend")));
app.use("/api/v1/users", authRoutes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

module.exports = app;