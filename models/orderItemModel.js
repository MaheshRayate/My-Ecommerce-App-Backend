const { default: mongoose } = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String, // Optional, if size is relevant
  },

  price: {
    type: Number,
    required: true,
  },

  discountedPrice: {
    type: Number,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

orderItemSchema.pre(/^find/, function (next) {
  this.populate("product");
  next();
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;
