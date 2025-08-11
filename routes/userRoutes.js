const mongoose = require("mongoose");
const authControllers = require("./../controllers/authControllers");
const userControllers = require("./../controllers/userControllers");
const express = require("express");

const router = express.Router();

router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);

router.route("/").get(userControllers.getAllUsers);

router.route("/:id").get(userControllers.getUser);

module.exports = router;
