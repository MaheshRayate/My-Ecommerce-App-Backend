const catchAsync = require("../utils/catchAsync");
const Product = require("./../models/productModel");

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  console.log("Product Created");

  res.status(201).json({
    status: "successs",
    data: {
      product,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  console.log(req.query);

  const queryObj = { ...req.query };
  const excludedQueries = ["limit", "sort", "page", "fields"];
  excludedQueries.forEach((el) => delete queryObj[el]);

  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|lte|lt|gt)\b/g,
    (match) => `$${match}`
  );

  let parsedQuery = JSON.parse(queryString);

  // ✅ Handle price range: "1500 - 2000" → { $gte: 1500, $lte: 2000 }
  if (parsedQuery.price && typeof parsedQuery.price === "string") {
    if (parsedQuery.price.includes("-")) {
      const [min, max] = parsedQuery.price
        .split("-")
        .map((v) => Number(v.trim()));
      parsedQuery.price = { $gte: min, $lte: max };
    } else {
      parsedQuery.price = Number(parsedQuery.price);
    }
  }
  // If already object (from query params with gte/lte), convert to numbers
  else if (typeof parsedQuery.price === "object") {
    for (let op in parsedQuery.price) {
      parsedQuery.price[op] = Number(parsedQuery.price[op]);
    }
  }

  // ✅ Handle case-insensitive and multi-value filters (excluding price)
  for (let key in parsedQuery) {
    if (key !== "price" && typeof parsedQuery[key] === "string") {
      if (parsedQuery[key].includes(",")) {
        parsedQuery[key] = {
          $in: parsedQuery[key]
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        };
      } else {
        parsedQuery[key] = new RegExp(`^${parsedQuery[key]}$`, "i");
      }
    }
  }

  let query = Product.find(parsedQuery);

  // Sorting
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 300;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numProducts = await Product.countDocuments();
    if (skip >= numProducts) {
      throw new Error("This Page does not Exists");
    }
  }

  const products = await query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});
