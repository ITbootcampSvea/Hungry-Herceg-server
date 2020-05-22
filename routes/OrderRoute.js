const router = require("express").Router();
const Order = require("../models/Order");

// router middleware

// find
router.get("/", async (req, res) => {
  console.log(req.logged);
  const orders = await Order.find();
  res.json({
    orders,
    message: "Success",
  });
});

// get one
router.get("/:orderId", async (req, res) => {
  const id = req.params.orderId;
  let order;
  try {
    order = await Order.findById(id);
  } catch (err) {
    res.json({
      message: "Order doesn't exist",
    });
  }
  res.json({
    order,
    message: "Success",
  });
});

router.post("/", async (req, res) => {
  let order = {
    pollId: req.body.pollId,
    restaurantId: req.body.restaurantId,
    duration: 10,
    status: true,
    orderItemsList: []
  };
  //save to db
  const createdOrder = new Order(order);
  let savedOrder;
  try {
    savedOrder = await createdOrder.save();
  } catch (err) {
    console.log(err);
  }

  // send result
  res.json({
    order: {
      ...savedOrder._doc,
    },
    message: "Success",
  });
});

// edit
router.put("/:orderId", async (req, res) => {
  try {
    // findOneAndUpdate wont return new data but same data
    const order = await Order.findOneAndUpdate(
      req.params.orderId,
      {
        ...req.body,
      },
      { useFindAndModify: false }
    );
    res.json({
      order: {
        ...order._doc,
        ...req.body,
      },
      message: "Success",
    });
  } catch (err) {
    console.log(err);
  }
});

// edit
router.patch("/:orderId", async (req, res) => {
  try {
    // id, data for update, options
    const order = await Order.findOneAndUpdate(
      req.params.orderId,
      { ...req.body },
      { useFindAndModify: false }
    );
    res.json({
      order: {
        ...order._doc,
        ...req.body,
      },
      message: "Success",
    });
  } catch (err) {
    console.log(err);
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
