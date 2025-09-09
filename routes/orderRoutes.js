const express = require("express");
const router = express.Router();
const authControllers = require("./../controllers/authControllers");
const orderControllers = require("./../controllers/orderControllers");

router.route("/getKey").get(
  authControllers.protect,
  orderControllers.getRazorpayKey
  // orderControllers.getSample
);

router
  .route("/paymentVerification")
  .post(authControllers.protect, orderControllers.paymentVerification);

router
  .route("/payment")
  .post(authControllers.protect, orderControllers.createRazorpayOrder);

router
  .route("/")
  .post(authControllers.protect, orderControllers.createOrder)
  .get(authControllers.protect, orderControllers.getAllOrders);

router
  .route("/:id")
  .post(authControllers.protect, orderControllers.createOrder)
  .get(authControllers.protect, orderControllers.getAllOrders);

module.exports = router;
