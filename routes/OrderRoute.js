const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

const {getResponse, prepareOrders} = require('../helpers');

// GET
// returns all order items
router.get("/", async (req, res) => {
    try{
        let orders = await Order.find();
        orders = await prepareOrders(orders);
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
        let order = await Order.findById(req.params.orderId);
        if(order){
            order = await prepareOrders([order]);
            return res.status(200).json(getResponse(order[0], 'Success'));
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

    // enrich
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
    if(!req.logged){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }

    try {
        let order = await Order.findOneAndUpdate({_id: req.params.orderId}, { ...req.body }, {useFindAndModify: false});
        if(order){
            order = await prepareOrders([order]);
            return res.status(200).json(getResponse({ ...order[0], ...req.body }, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Error while editing poll'));
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

// delete
router.delete("/:orderId", async (req, res) => {
    if(!req.logged){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }

    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
        // izbrisi sve orderiteme iz user.history (a mozda i ne)
        if(deletedOrder){
            return res.status(200).json(getResponse(null, 'Success'));
        } else {
            return res.status(404).json(getResponse(null, 'Not Found'));
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
