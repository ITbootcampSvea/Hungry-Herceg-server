const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  pollId: {
    type: Number,
    required: true,
  },
  restaurantId: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  orderItemsList: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
