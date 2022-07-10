const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const OrderItem = require('../models/order_items');

router = express.Router();

// Get list of Users
router.get('/', async (req, res) => {
  const order = await Order.find()
    .populate('user', 'name')
    .sort({ dateOrdered: -1 }); // sort from the newest to oldest

  if (!order) {
    res.status(500).send('Server could not get order Items');
  }

  res.status(200).send(order);
});

// Get a Single User
router.get('/:id', async (req, res) => {
  const orderId = req.params.id;
  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).send('Invalid ID passed by user URL');
  }

  const order = await Order.findById(orderId)
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'name',
        populate: { path: 'category', select: 'name' },
      },
    })
    .sort({ dateOrdered: -1 }); // sort from the newest to oldest

  if (!order) {
    res.status(500).send('Server could not get order Items');
  }

  res.status(200).send(order);
});

// Post an Order
router.post('/', async (req, res) => {
  // Get orderItems sent by the user and loop through using the map()

  const orderItemId = Promise.all(
    // Because we are returning multiple promises
    req.body.orderItems.map(async (orderItem) => {
      // user sends one orderItem ie '(orderItem)'
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemsIdResolved = await orderItemId;

  // Calculate the total price
  const totalPrices = await Promise.all(
    orderItemsIdResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        'product',
        'price'
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;

      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b);

  let order = new Order({
    orderItems: orderItemsIdResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  if (!order) {
    res.status(500).send('Cannot create Oder');
  }

  res.status(200).send(order);
});

// Update an Order
router.patch('/:id', async (req, res) => {
  const orderId = req.params.id;
  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).send('Invalid ID passed by user URL');
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) {
    res.status(500).send('Order could not be updated');
  }

  res.status(200).send(order);
});

// Delete an order
router.delete('/:id', async (req, res, next) => {
  const orderId = req.params.id;

  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).send('Invalid ID passed by user URL');
  }

  const order = await Order.findByIdAndRemove(orderId);

  try {
    if (!order) {
      res.status(404).send({ success: false, message: 'order not found' });
    }

    await order.orderItems.map(async (orderItem) => {
      await OrderItem.findByIdAndRemove(orderItem);
    });

    res
      .status(200)
      .json({ success: true, message: 'order successfully deleted' });
  } catch (error) {
    return res.status(400).json({ success: false, errorFound: error });
  }
});

// Get total sales
router.get('/get/totalsales', async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
  ]);

  if (!totalSales) {
    return res.status(400).send('The order sales cannot be generated');
  }

  res.send({ totalSales: totalSales.pop().totalSales }); // show only the totalSales aggregate
});

// Get the total number of products
router.get('/get/count', async (req, res, next) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    orderCount,
  });
});

// History of orders

router.get('/get/userorders/:userid', async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'name',
        populate: { path: 'category', select: 'name' },
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).send({ success: false });
  }

  res.status(200).send(userOrderList);
});

module.exports = router;
