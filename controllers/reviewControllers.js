const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res) => {
  // Finding reviews of a particular product if there is productId in the params(NESTED ROUTE)
  let filter = {};

  if (req.params.productId) {
    filter = { product: req.params.productId };
  }

  //GET All reviews if there is no tourId on url
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res) => {
  const id = req.params.id;

  const review = await Review.findById(id);

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res) => {
  const id = req.params.id;
  const review = await Review.findByIdAndUpdate(id, req.body);
  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  const id = req.params.id;
  await Review.findByIdAndDelete(id);
  res.status(204).json({
    status: "successs",
    data: null,
  });
});
