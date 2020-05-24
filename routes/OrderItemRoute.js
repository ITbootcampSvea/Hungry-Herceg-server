const express = require("express");
const router = express.Router();

const {getResponse} = require('../helpers');

// orderItem model
const Order = require('../models/Order');
const OrderItem = require("../models/OrderItem");
const Meal = require('../models/Meal');
const User = require('../models/User');

const prepareOrderItems = orderItems => {
    return new Promise((resolve, reject) => {
        let newOrderItems = [];
        orderItems.forEach(async (orderItem, i, arr) => {
            try{
                const meal = await Meal.findById(orderItem.meal);

                newOrderItems.push({
                    ...orderItem._doc,
                    meal: meal
                });

                if(arr.length-1 == i){
                    resolve(newOrderItems);
                }
            } catch(err){
                console.log(err);
                reject(err);
            }
        });
    });
}

// GET
// returns all order itemss
router.get("/", async (req, res) => {
    try{
        let orderItems = await OrderItem.find();

        if(orderItems.length == 0){
            return res.status(200).json(getResponse([], 'Success'));
        }

        orderItems = await prepareOrderItems(orderItems);
        return res.status(200).json(getResponse(orderItems, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

router.get('/:orderItemId', async (req, res) => {
    try{
        let orderItem = await OrderItem.findById(req.params.orderItemId);
        orderItem = await prepareOrderItems([orderItem]);
        return res.status(200).json(getResponse(orderItem[0], 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
})

router.post('/', async (req, res,) => {
    /*if(!req.logged && req.user != 'admin'){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }*/

    const {orderId, user, meal, quantity, note} = req.body;

    try{
        const orderItem = new OrderItem({
            orderId: orderId,
            user: req.user,
            meal: meal,
            quantity: quantity,
            note: note
        });
        let savedOrderItem = await orderItem.save();
        if(savedOrderItem){
            // save to user history object
            const user = await User.findById(req.userId);
            user.history.push(savedOrderItem._id);
            await user.save();

            const order = await Order.findById(orderId);
            order.orderItemList.push(savedOrderItem._id);
            await order.save();

            // prepare orderItem response
            savedOrderItem = await prepareOrderItems([savedOrderItem]);
            return res.status(200).json(getResponse(savedOrderItem[0], 'Success'));
        } else {
            return res.status(500).json(getResponse(null, 'Error while saving OrderItem'));
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

router.put('/:orderItemId', async (req, res) => {
    /*if(!req.logged && req.user != 'admin'){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }*/

    const {orderItemId} = req.params;
    try{
        let editedOrderItem = await OrderItem.findByIdAndUpdate(
            {_id: req.params.orderItemId}, 
            {...req.body},
            {useFindAndModify: false});
        editedOrderItem = await prepareOrderItems([editedOrderItem]);
        return res.status(200).json(getResponse({...editedOrderItem[0], ...req.body}, 'Success'));
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

router.delete('/:orderItemId', async (req, res) => {
    /*if(!req.logged && req.user != 'admin'){
        return res.status(403).json(getResponse(null, 'Unauthorized'));
    }*/

    const {orderItemId} = req.params;
    try{
        const deletedOrderItem = await OrderItem.findByIdAndDelete({_id: orderItemId});
        if(deletedOrderItem){
            return res.status(200).json(getResponse(null, 'Success'));
        } else {
            return res.status(200).json(getResponse(null, 'Not Found'));
        }
    } catch(err){
        console.log(err);
        return res.status(500).json(getResponse(null, err));
    }
});

module.exports = router;
