import asyncHandler from "express-async-handler";

import Order from "../models/orderModel.js";

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc Get order by id
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  // using populate can get the User model ref we setup in orderModel
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  // pass the order details back if the request is by a admin or the user
  // === does not work for userid since it compares reference and not the values
  // refer -> https://stackoverflow.com/questions/11060213/mongoose-objectid-comparisons-fail-inconsistently

  if (order && (req.user.isAdmin || order.user._id.equals(req.user._id))) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export { addOrderItems, getOrderById };
