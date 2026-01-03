const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createOrderController } = require("../controllers/orderController");

router.post("/create", authMiddleware, createOrderController);

module.exports = router;
