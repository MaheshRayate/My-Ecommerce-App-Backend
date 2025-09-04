const mongoose = require("mongoose");
const Product = require("./productModel");
const Cart = require("./cartModel");

const cartItemSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Cart",
  },

  product: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Product",
  },

  size: {
    type: String,
    default: "M",
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

  price: {
    type: Number,
    required: true,
  },

  discountedPrice: {
    type: Number,
  },
});

cartItemSchema.index({ cart: 1, product: 1 }, { unique: true });

cartItemSchema.statics.calcTotalCartSummary = async function (cartId) {
  const stats = await this.aggregate([
    {
      $match: { cart: cartId },
    },
    {
      $group: {
        _id: "$cart",
        totalPrice: { $sum: { $multiply: ["$price", "$quantity"] } },
        totalDiscountedPrice: {
          $sum: { $multiply: ["$discountedPrice", "$quantity"] },
        },
        totalItem: { $sum: "$quantity" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Cart.findByIdAndUpdate(cartId, {
      totalPrice: stats[0].totalPrice,
      totalDiscountedPrice: stats[0].totalDiscountedPrice,
      totalItem: stats[0].totalItem,
      discount: stats[0].totalPrice - stats[0].totalDiscountedPrice,
    });
  } else {
    // If no items in cart, reset everything
    await Cart.findByIdAndUpdate(cartId, {
      totalPrice: 0,
      totalDiscountedPrice: 0,
      totalItem: 0,
      discount: 0,
    });
  }
};

cartItemSchema.pre(/^find/, function (next) {
  this.populate("product");
  next();
});

cartItemSchema.pre("save", async function (next) {
  // If price is already set and product not modified, skip re-fetching
  if (!this.isModified("product")) return next();

  try {
    const product = await mongoose.model("Product").findById(this.product);

    if (!product) {
      return next(new Error("Product not found for this cart item"));
    }

    // Fill price and discounted price
    this.price = product.price;
    this.discountedPrice = product.discountedPrice || product.price; // fallback if no discount

    next();
  } catch (err) {
    next(err);
  }
});

cartItemSchema.post("save", function () {
  this.constructor.calcTotalCartSummary(this.cart); //calling the static method to calculate the cart summary
});

cartItemSchema.pre(/^findOneAnd/, async function (next) {
  this.c = await this.findOne();
  next();
});

cartItemSchema.post(/^findOneAnd/, async function () {
  await this.c.constructor.calcTotalCartSummary(this.c.cart);
  next();
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
