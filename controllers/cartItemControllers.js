const catchAsync = require("../utils/catchAsync");
const CartItem = require("./../models/cartItemModel");
const Cart = require("./../models/cartModel");

exports.addCartItem = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { product, quantity, size } = req.body;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, cartItems: [] });
  }

  // check if a cartItem already exists for this product in this cart
  let existingItem = await CartItem.findOne({
    cart: cart._id,
    product: product,
  });

  if (existingItem) {
    // update quantity
    existingItem.quantity += quantity;
    await existingItem.save();
  } else {
    // create new cartItem
    const cartItem = await CartItem.create({
      cart: cart._id,
      product: product,
      size,
      quantity,
      price: 1000, // you’d fetch from Product model
      discountedPrice: 900, // apply discount logic
    });

    cart.cartItems.push(cartItem._id);
  }

  await cart.save();

  res.status(201).json({
    status: "success",

    data: await cart.populate({
      path: "cartItems",
      populate: {
        path: "product",
        select: "_id title price discountedPrice discountPersent imageUrl",
      },
    }),
  });
});

exports.getAllCartItems = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });

  const cartItems = await CartItem.find({ cart: cart._id });
  console.log(cartItems);

  res.status(200).json({
    status: "success",
    data: {
      cartItems,
    },
  });
});

exports.getCartItem = catchAsync(async (req, res, next) => {
  const cartItem = await CartItem.findById(req.body.id);
  res.status(200).json({
    status: "success",
    data: {
      cartItem,
    },
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const cartItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: false,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      cartItem,
    },
  });
});

exports.deleteCartItem = catchAsync(async (req, res, next) => {
  await CartItem.findByIdAndDelete(req.body.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
