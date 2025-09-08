const express = require("express");
const router = express.Router();
const authControllers = require("./../controllers/authControllers");
const orderControllers = require("./../controllers/orderControllers");

router.route("/").post(authControllers.protect, orderControllers.createOrder);

router
  .route("/payment")
  .post(authControllers.protect, orderControllers.createRazorpayOrder);

router
  .route("/getKey")
  .get(authControllers.protect, orderControllers.getRazorpayKey);

router
  .route("/paymentVerification")
  .post(authControllers.protect, orderControllers.paymentVerification);

module.exports = router;
