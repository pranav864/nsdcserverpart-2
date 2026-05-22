const express = require("express");
const cors = require("cors");

const authRoutes = require("./backend/routes/authroute");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/users", authRoutes);

module.exports = app;