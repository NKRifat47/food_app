const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRouter");
const restaurentRouter = require("./routes/restaurentRoute");
const categoryRouter = require("./routes/categoryRoute");
const foodRouter = require("./routes/foodRoute");
const orderRouter = require("./routes/orderRoute");
const adminRouter = require("./routes/adminRoute");
const paymentRouter = require("./routes/paymentRoute");
const stripeWebhookRoute = require("./routes/stripeWebhookRoute");


const app = express();

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/restaurent", restaurentRouter);
app.use("/api/category", categoryRouter);
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/stripe", stripeWebhookRoute);

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
