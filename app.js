const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRouter")
const restaurentRouter = require("./routes/restaurentRoute")

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/restaurent", restaurentRouter)

app.get("/", (req, res) => res.send("Hello World!"));

module.exports = app;
