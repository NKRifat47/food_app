const stripe = require("../services/stripe");
const Order = require("../models/orderModel");
const { sendAdminOrderEmail } = require("../services/mailService");

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

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        orderStatus: "preparing",
      },
      { new: true }
    )
      .populate("items.food")
      .populate("restaurant");

    await sendAdminOrderEmail(order);

    console.log("Order marked as PAID & email sent:", orderId);
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
