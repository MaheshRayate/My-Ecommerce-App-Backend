const mongoose = require("mongoose");
const User = require("./userModel");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there's a User model
    required: true,
  },

  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Optional: Basic 10-digit phone validation
  },
  address: {
    type: String,
    // required: true,
    trim: true,
  },

  city: {
    type: String,
    required: true,
    trim: true,
  },

  postalCode: {
    type: String,
    required: true,
    trim: true,
  },

  state: {
    type: String,
    // required: true,
    trim: true,
  },

  country: {
    type: String,
    default: "India",
    trim: true,
  },

  addressType: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
});

addressSchema.pre("save", async function (next) {
  console.log("Address prehook");
  await User.findByIdAndUpdate(this.user, {
    $addToSet: { addresses: this._id }, // $addToSet prevents duplicates
  });
  next();
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
