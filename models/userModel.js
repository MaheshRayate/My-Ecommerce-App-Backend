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

  role: {
    type: String,
    default: "customer",
    required: [true, "User should have a role"],
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

// Static Methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
