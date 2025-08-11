const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 40,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Supports subcategories
    default: null,
  },

  level: {
    type: Number,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
