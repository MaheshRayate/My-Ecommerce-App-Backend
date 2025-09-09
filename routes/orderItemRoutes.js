const express = require("express");
const router = express.Router();
const authControllers = require("./../controllers/authControllers");
const orderItemControllers = require("./../controllers/orderItemControllers");

router
  .route("/:id")
  .get(authControllers.protect, orderItemControllers.getOrderItem);

router
  .route("/getOrderDetailsFromOrderItem/:orderItemId")
  .get(authControllers.protect, orderItemControllers.getOrderFromOrderItem);

module.exports = router;
