const express = require("express");
const router = express.Router();
const {getResponse} = require('../helpers');

// order model
const Order = require("../models/Order");

// GET
// returns all order items
router.get("/", async (req, res) => {
    try{
        const orders = await Order.find();
        return res.status(200).json(getResponse(orders, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// GET
// returns one order found by id
router.get("/:orderId", async (req, res) => {
    try{
        const order = await Order.findById(req.params.orderId);
        if(order){
            return res.status(200).json(getResponse(order, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'));
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

//POST
//creates new order
router.post("/", async (req, res) => {
    if(!req.logged){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }

    const newOrder = new Order({
        pollId: req.body.pollId,
        restaurantId: req.body.restaurantId,
        duration: 20,
        status: true,
        orderItemsList: []
    });
    try {
        const savedOrder = await newOrder.save();
        if(savedOrder){
            return res.status(200).json(getResponse(savedOrder, 'Success'));
        } else {
            return res.status(500).json(getResponse(null, 'Error while saving Order'));
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
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
