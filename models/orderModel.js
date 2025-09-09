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
    default: Date.now,
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
    enum: [
      "Placed",
      "Confirmed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Placed",
  },

  deliveryDate: {
    type: Date,
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

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "orderItems",
    populate: {
      path: "product",
      model: "Product", // optional if Mongoose can infer
    },
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
