// models/Order.js

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],

  orderDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },

  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI", "NetBanking"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    transactionId: {
      type: String,
    },
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  totalDiscountedPrice: {
    type: Number,
    required: true,
  },

  discount: {
    type: Number,
    required: true,
  },

  totalItems: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },

  deliveryDate: {
    type: Date,
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  isCancelled: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
