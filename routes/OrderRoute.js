const express = require("express");
const router = express.Router();

// order model
const Order = require("../models/Order");

// GET
// returns all order items
router.get("/", (req, res) => {
  Order.find()
    .sort({ duration: -1 })
    .then((orders) => res.json(orders));
});

// GET
// returns one order found by id
router.get("/:orderId", async (req, res) => {
  try {
    let order = await Order.findById(req.params.orderId);
    return res.status(200).json({ message: order });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
});

//POST
//creates new order
router.post("/", async (req, res) => {
  const newOrder = new Order({
    pollId: req.body.pollId,
    restaurantId: req.body.restaurantId,
    duration: 20,
    status: true,
    orderItemsList: [],
  });
  try {
    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//edit
//change order by id
router.put("/:orderId", async (req, res) => {
  try {
    const foundOrder = await Order.findById(req.params.orderId);
    foundOrder.status = req.body.status;
    foundOrder.orderItemsList = req.body.orderItemsList
    res.json(foundOrder);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// delete
router.delete("/:orderId", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    res.json({
      order: { ...deletedOrder._doc },
      message: "Success",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
