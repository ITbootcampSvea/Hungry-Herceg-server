const express = require("express");
const router = express.Router();

// orderItem model
const OrderItem = require("../models/OrderItem");

// GET
// returns all order itemss
router.get("/", (req, res) => {
    OrderItem.find()
    .sort({ duration: -1 })
    .then((orders) => res.json(orders));
});



module.exports = router;
