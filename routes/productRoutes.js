const express = require("express");
const productControllers = require("./../controllers/productControllers");

const router = express.Router();

router
  .route("/")
  .get(productControllers.getAllProducts)
  .post(productControllers.createProduct);

router.route("/:id").get(productControllers.getProduct);

module.exports = router;
