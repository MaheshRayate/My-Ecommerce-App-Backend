const express = require("express");
const addressControllers = require("./../controllers/addressControllers");
const authControllers = require("./../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .get(addressControllers.getAllAddresses)
  .post(authControllers.protect, addressControllers.createAddress);

router
  .route("/:id")
  .get(addressControllers.getAddress)
  .delete(authControllers.protect, addressControllers.deleteAddress);

module.exports = router;
