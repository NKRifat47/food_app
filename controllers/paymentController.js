const stripe = require("../services/stripe");
const Order = require("../models/orderModel");

exports.createPaymentIntentController = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalAmount * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
