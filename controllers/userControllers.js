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
