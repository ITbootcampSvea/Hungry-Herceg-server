const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  orderId: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  mealId: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
