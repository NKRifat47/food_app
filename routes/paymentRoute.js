const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createPaymentIntentController,
} = require("../controllers/paymentController");

router.post("/create-intent", authMiddleware, createPaymentIntentController);

module.exports = router;
