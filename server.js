const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

const auth = require("./middleware/auth");
const userRoute = require("./routes/UserRoute");
const pollRoute = require("./routes/PollRoute");
const restaurantRoute = require("./routes/RestaurantRoute");
const orderRoute = require("./routes/OrderRoute");
const mealRoute = require("./routes/MealRoute");
const orderItemRoute = require("./routes/OrderItemRoute");

// middlewares
app.use(express.json());
app.use(auth);

// useless interval
/*let i = 0;
setInterval(() => {
    console.log(i);
    i++;   
}, 1000);*/

app.use("/user", userRoute);
app.use("/poll", pollRoute);
app.use("/order", orderRoute);
app.use("/restaurant", restaurantRoute);
app.use("/meal", mealRoute);
app.use("/orderitem", orderItemRoute);

// connect to mongodb cluster
mongoose
  .connect(
    `mongodb+srv://nikolahot:pasteta@mydb-x0kvb.mongodb.net/hunry-herceg?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then((res) => {
    app.listen(port, (req, res) => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
