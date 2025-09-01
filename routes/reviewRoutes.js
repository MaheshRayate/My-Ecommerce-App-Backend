const express = require("express");
const reviewControllers = require("./../controllers/reviewControllers");
const authControllers = require("./../controllers/authControllers");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewControllers.getAllReviews)
  .post(authControllers.protect, reviewControllers.createReview);

router
  .route("/:id")
  .get(reviewControllers.getReview)
  .patch(reviewControllers.updateReview)
  .delete(reviewControllers.deleteReview);

module.exports = router;
