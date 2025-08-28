const mongoose = require("mongoose");
const authControllers = require("./../controllers/authControllers");
const userControllers = require("./../controllers/userControllers");
const express = require("express");

const router = express.Router();

router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);

router.route("/").get(authControllers.protect, userControllers.getAllUsers);
router
  .route("/profile")
  .get(authControllers.protect, authControllers.getUserProfile);

router.route("/:id").get(userControllers.getUser);
router.route("/:id").patch(userControllers.updateUser);

module.exports = router;
