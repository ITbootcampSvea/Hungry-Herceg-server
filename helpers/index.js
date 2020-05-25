const Order = require('../models/Order');
const OrderItem = require("../models/OrderItem");
const Meal = require('../models/Meal');
const User = require('../models/User');

const getResponse = (data, message) => {
    return {
        data: data,
        message: message
    }
}

const prepareOrderItems = orderItems => {
    return new Promise((resolve, reject) => {
        if(orderItems.length == 0){
            resolve([]);
        } else {
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
        }
    });
}

const getOrderItemList = orderItemIds => {
    return new Promise(async (resolve, reject) => {
        try{
            let orderItems = await OrderItem.find({_id: {$in: orderItemIds}});
            orderItems = await prepareOrderItems(orderItems);

            resolve(orderItems);
        } catch(err){
            console.log(err);
            reject(err);
        }
    });
}

const prepareOrders = async orders => {
    // enrich order object orderItems and meals
    return new Promise(async (resolve, reject) => {
        let newOrders = [];
        /*orders.forEach(async (order, index, arr) => {
            try{
                if(order.orderItemList.length == 0){
                    newOrders.push({...order._doc});
                } else {
                    const orderItemList = await getOrderItemList(order.orderItemList);
    
                    newOrders.push({
                        ...order._doc,
                        orderItemList: orderItemList
                    });
                }

                if(arr.length-1 == index){
                    resolve(newOrders)
                }
            } catch(err){
                console.log(err);
                reject(err);
            }
        });*/

        for(let i = 0; i < orders.length; i++){
            try{
                if(orders[i].orderItemList.length == 0){
                    newOrders.push({...orders[i]._doc});
                } else {
                    const orderItemList = await getOrderItemList(orders[i].orderItemList);
    
                    newOrders.push({
                        ...orders[i]._doc,
                        orderItemList: orderItemList
                    });
                }
            } catch(err){
                console.log(err);
                reject(err);
            }
        }
        resolve(newOrders);
    });
}

module.exports = {
    getResponse,
    prepareOrderItems,
    prepareOrders
}