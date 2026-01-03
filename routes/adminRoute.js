const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const {
  updateOrderStatusController,
  getAllOrdersAdmin,
} = require("../controllers/orderController");

router.put(
  "/order/status/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatusController
);

router.get("/orders", authMiddleware, adminMiddleware, getAllOrdersAdmin);

module.exports = router;
