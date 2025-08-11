const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  discountedPrice: {
    type: Number,
  },

  discountPersent: {
    type: Number,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    // required: true,
  },

  brand: {
    type: String,
    required: [true, "Brand is required"],
  },

  imageUrl: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    default: 0,
  },

  sizes: [
    {
      name: { type: String },
      quantity: { type: Number },
    },
  ],

  color: {
    type: String,
    required: true,
  },

  topLavelCategory: {
    type: String,
  },
  secondLavelCategory: {
    type: String,
  },

  thirdLavelCategory: {
    type: String,
  },

  numRatings: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
