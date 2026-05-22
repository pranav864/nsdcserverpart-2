const express = require("express");

const router = express.Router();

const {
  registeruser,
  loginuser,
  logoutuser
} = require("../controllers/authcontroller");

router.post("/register", registeruser);
router.post("/login", loginuser);
router.post("/logout", logoutuser);

module.exports = router;