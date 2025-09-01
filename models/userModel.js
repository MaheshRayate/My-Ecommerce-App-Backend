const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "User should have a first name"],
  },

  lastName: {
    type: String,
    required: [true, "User should have a last name"],
  },

  password: {
    type: String,
    required: [true, "User should provide password"],
  },

  email: {
    type: String,
    required: [true, "User should provide email"],
  },

  phone: {
    type: String,
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },

  dob: {
    type: Date,
  },

  role: {
    type: String,
    default: "customer",
    required: [true, "User should have a role"],
  },

  passwordChangedAt: {
    type: Date,
  },

  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],

  paymentInformation: [
    { type: mongoose.Schema.Types.ObjectId, ref: "PaymentInfo" },
  ],

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

// Mongoose Middlewares
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Populating Addresses

userSchema.pre(/^find/, function (next) {
  console.log("Pre Hook");
  this.populate({
    path: "addresses",
  });
  next();
});

// Static Methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  console.log(this.passwordChangedAt);
  if (this.passwordChangedAt != undefined) {
    // console.log("Here I'm🐶🐶🐶 stuck in changedPasswordAfter");
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(changedTimeStamp, JWTTimestamp);

    return JWTTimestamp < changedTimeStamp;
    // if this is true we'll throw error see that in authController.js
  }

  // by default, we will return false because we assume that the user did not change the password
  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
