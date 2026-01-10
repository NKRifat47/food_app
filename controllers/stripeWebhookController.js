const stripe = require("../services/stripe");
const Order = require("../models/orderModel");

exports.stripeWebhookController = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      orderStatus: "preparing",
    });

    console.log("Order marked as PAID:", orderId);
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "failed",
    });

    console.log("Payment failed for order:", orderId);
  }

  res.json({ received: true });
};
