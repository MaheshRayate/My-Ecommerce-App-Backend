const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true, //for preventing cross site scripting
  sameSite: "none", //set sameSite:none and secure:true in prod and sameSite:'lax' and secure:false in dev
  secure: true,
};

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, statusCode, res) => {
  /*So first of all, a cookie is basically just a small piece of text that a server can send to clients. Then when the client receives a cookie, it will automatically store it and then automatically send it back along with all future requests to the same server. */

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

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are Not logged in! Please log in to get access.", 401)
    );
  }

  // Verifying JWT TOKEN

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  const freshUser = await User.findById(decoded.id);
  // checking if user belonging to the token exists
  if (!freshUser) {
    return next(
      new AppError(
        `The user belonging to this token does no longer exists!`,
        401
      )
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User Recently Changed the Password!Please Login again!",
        401
      )
    );
  }

  req.user = freshUser;
  // console.log("Authenticated User:", req.user);
  next();
});

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
});
