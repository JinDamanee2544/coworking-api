const express = require("express");
const { register, login, getMe, logout } = require("../controllers/auth");
const { protect } = require("../middlewares/auth");
const router = express.Router();

router
    .post("/register", register)
    .post("/login", login)
    .post("/logout", logout)
    .get("/me", protect, getMe);

module.exports = router;
