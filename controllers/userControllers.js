const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/userModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    throw new Error("No user found with that Id!");
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// for admin to update user
exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// LOGGED IN USERS

// Updating a loggedin user's data but not password
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1)Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for updating Password. Instead use /updateMyPassword",
        400
      )
    );
  }
  // 2)Update user document

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "phone",
    "gender",
    "dob"
  );

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.toggleWishList = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const user = await User.findById(req.user._id);
  console.log("Here I'm");

  if (!user) {
    return next(new AppError("No user found", 404));
  }

  if (user?.wishList?.length === 0) {
    user.wishList.push(productId);
  } else {
    const index = user?.wishList?.indexOf(productId);
    if (index === -1) {
      // Product not in wishlist → add it
      user.wishList.push(productId);
    } else {
      // Product already in wishlist → remove it
      user?.wishList?.splice(index, 1);
    }
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      wishList: user.wishList,
    },
  });
});

exports.getWishList = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      wishList: user.wishList,
    },
  });
});
