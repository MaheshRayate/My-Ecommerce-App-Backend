const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  // secure:true, //makes it work only on https
  httpOnly: true, //for preventing cross site scripting
};

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  /*So first of all, a cookie is basically just a small piece of text that a server can send to clients. Then when the client receives a cookie, it will automatically store it and then automatically send it back along with all future requests to the same server. */

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  const token = signToken(user._id);

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, role } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new AppError("User Already exists with that email!", 400);
  }
  const user = await User.create(req.body);
  const token = signToken(user._id);

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide the email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password!", 401));
  }

  const token = signToken(user._id);

  createSendToken(user, 200, res);
});
