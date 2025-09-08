const Order = require("./../models/orderModel");
const OrderItem = require("./../models/orderItemModel");
const Cart = require("./../models/cartModel");
const CartItem = require("./../models/cartItemModel");
const catchAsync = require("./../utils/catchAsync");
const razorpayInstance = require("./../utils/razorpay");
const crypto = require("crypto");

exports.createOrder = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { paymentMethod, addressId } = req.body;
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "cartItems",
    populate: { path: "product" },
  });

  if (!cart || cart.cartItems.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "Your Cart is Empty",
    });
  }

  const orderItems = await Promise.all(
    cart.cartItems.map(async (cartItem) => {
      const orderItem = await OrderItem.create({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
        size: cartItem.size,
        price: cartItem.price,
        discountedPrice: cartItem.discountedPrice,
        user: userId,
      });
      return orderItem._id;
    })
  );

  const newOrder = await Order.create({
    user: userId,
    orderItems,
    shippingAddress: addressId,
    paymentDetails: {
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
    },
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discount: cart.discount,
    totalItems: cart.totalItem,
    totalAmount: cart.totalDiscountedPrice, // final payable
  });

  await CartItem.deleteMany({ cart: cart._id });
  cart.cartItems = [];
  cart.totalPrice = 0;
  cart.totalDiscountedPrice = 0;
  cart.totalItem = 0;
  cart.discount = 0;
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Order Successfull",

    data: {
      order: newOrder,
    },
  });
});

exports.createRazorpayOrder = catchAsync(async (req, res) => {
  const { amount, addressId } = req.body;
  const options = {
    amount: Number(req.body.amount * 100),

    currency: "INR",
  };

  const order = await razorpayInstance.orders.create(options);

  res.status(201).json({
    status: "success",
    data: {
      order,
      addressId,
    },
  });
});

exports.getRazorpayKey = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      key: process.env.RAZORPAY_API_KEY,
    },
  });
});

// exports.paymentVerification = catchAsync(async (req, res) => {
//   const frontendUrl =
//     process.env.NODE_ENV === "production"
//       ? process.env.FRONTEND_PROD_URL
//       : process.env.FRONTEND_DEV_URL;

//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//     req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   console.log(`Razorpay Signature,${razorpay_signature}`);
//   console.log(`Expected Signature,${expectedSignature}`);

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {
//     return res.redirect(
//       `${frontendUrl}/cart/payment/paymentSuccess?reference=${razorpay_payment_id}`
//     );
//   } else {
//     res.status(400).json({
//       status: "fail",
//       message: "Verification Failed",
//     });
//   }
// });

exports.paymentVerification = catchAsync(async (req, res) => {
  const frontendUrl =
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_PROD_URL
      : process.env.FRONTEND_DEV_URL;

  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    addressId,
  } = req.body;

  // console.log(
  //   razorpay_payment_id,
  //   razorpay_order_id,
  //   razorpay_signature,
  //   addressId
  // );

  const userId = req.user._id; // make sure user is authenticated

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  // console.log("isAuthentic - ", isAuthentic);

  if (!isAuthentic) {
    return res.status(400).json({
      status: "fail",
      message: "Payment verification failed",
    });
  }

  // ✅ If authentic → move Cart → Order
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "cartItems",
    populate: { path: "product" },
  });

  console.log("👹User - ", userId);

  // console.log("Cart⭐-", cart);

  if (!cart || cart.cartItems.length === 0) {
    return res.redirect(`${frontendUrl}/cart/payment/paymentFailed`);
  }

  const orderItems = await Promise.all(
    cart.cartItems.map(async (cartItem) => {
      const orderItem = await OrderItem.create({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
        size: cartItem.size,
        price: cartItem.price,
        discountedPrice: cartItem.discountedPrice,
        user: userId,
      });
      return orderItem._id;
    })
  );

  const newOrder = await Order.create({
    user: userId,
    orderItems,
    shippingAddress: addressId,
    paymentDetails: {
      paymentMethod: "Card",
      paymentStatus: "Paid",
      transactionId: razorpay_payment_id,
    },
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discount: cart.discount,
    totalItems: cart.totalItem,
    totalAmount: cart.totalDiscountedPrice,
  });

  // ✅ Empty the cart
  await CartItem.deleteMany({ cart: cart._id });
  cart.cartItems = [];
  cart.totalPrice = 0;
  cart.totalDiscountedPrice = 0;
  cart.totalItem = 0;
  cart.discount = 0;
  await cart.save();

  // ✅ Redirect with payment reference
  return res.redirect(
    `${frontendUrl}/cart/payment/paymentSuccess?reference=${razorpay_payment_id}`
  );
});
