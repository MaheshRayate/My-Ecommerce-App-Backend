const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Cart",
  },

  product: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Product",
  },

  size: {
    type: String,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

  price: {
    type: Number,
    required: true,
  },

  discountedPrice: {
    type: Number,
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
