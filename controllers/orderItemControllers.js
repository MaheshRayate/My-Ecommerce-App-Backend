const Order = require("./../models/orderModel");
const OrderItem = require("./../models/orderItemModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOrderItem = catchAsync(async (req, res) => {
  const orderItem = await OrderItem.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      orderItem,
    },
  });
});

exports.getOrderFromOrderItem = async (req, res) => {
    
  const orderItemId = req.params.orderItemId;
  const order = await Order.findOne({ orderItems: orderItemId })
    .populate("shippingAddress")
    .populate("user")
    .populate({
      path: "orderItems",
      populate: { path: "product" },
    });

  if (!order) {
    throw new AppError("No order found for this orderItemId", 400);
  }

  // Find the matching orderItem in the array
  const orderItem = order.orderItems.find(
    (oi) => oi._id.toString() === orderItemId.toString()
  );

  res.status(200).json({
    status: "success",
    data: {
      order,
      orderItem,
    },
  });

};
