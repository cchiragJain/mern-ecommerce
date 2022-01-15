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

// @desc Update order to be paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // get order by id
  const order = await Order.findById(req.params.id);
  // update pay details only if the request is by a admin or the user
  if (order && (req.user.isAdmin || order.user._id.equals(req.user._id))) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // this will come from the payment api
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // save also updates the value in mongoose
    // https://mongoosejs.com/docs/documents.html#updating-using-save
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export { addOrderItems, getOrderById, updateOrderToPaid };
