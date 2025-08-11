const express = require("express");
const productControllers = require("./../controllers/productControllers");

const router = express.Router();

router
  .route("/")
  .get(productControllers.getAllProducts)
  .post(productControllers.createProduct);

module.exports = router;
