const express = require("express");
const productControllers = require("./../controllers/productControllers");
const authControllers = require("./../controllers/authControllers");
const reviewControllers = require("./../controllers/reviewControllers");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// Nested Routes
router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .get(productControllers.getAllProducts)
  .post(productControllers.createProduct);

router.route("/:id").get(productControllers.getProduct);

// router
//   .route("/:productId/reviews")
//   .get(reviewControllers.getAllReviews)
//   .post(authControllers.protect, reviewControllers.createReview);

// router.route("/:productId/reviews/:reviewId").get(reviewControllers.getReview);

module.exports = router;
