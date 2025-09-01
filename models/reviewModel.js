const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a Product"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a User"],
    },

    rating: {
      type: Number,
      required: [true, "Review must have a rating"],
      min: [1, "Rating must be more than or equal to 1"],
      max: [5, "Rating must be less than or equal to 5"],
    },

    comment: {
      type: String,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  console.log("review Pre hook");
  this.populate({
    path: "user",
    select: "firstName lastName",
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
