const express = require("express");
const authControllers = require("./../controllers/authControllers");
const cartItemControllers = require("./../controllers/cartItemControllers");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authControllers.protect, cartItemControllers.getAllCartItems)
  .post(authControllers.protect, cartItemControllers.addCartItem);

router
  .route("/:id")
  .get(authControllers.protect, cartItemControllers.getCartItem)
  .patch(authControllers.protect, cartItemControllers.updateCartItem)
  .delete(authControllers.protect, cartItemControllers.deleteCartItem);

module.exports = router;
