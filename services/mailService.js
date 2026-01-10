const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.sendAdminOrderEmail = async (order) => {
  const itemsList = order.items
    .map(
      (item) =>
        `Food: ${item.food.title} | Qty: ${item.quantity} | Price: $${item.price}`
    )
    .join("\n");

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: "New Order Paid ✅",
    text: `
New Order Paid!

Order ID: ${order._id}
User ID: ${order.user}
Restaurant: ${order.restaurant.title}
Total Amount: $${order.totalAmount}
Payment ID: ${order.paymentIntentId}
Status: ${order.orderStatus}

Items:
${itemsList}

Date: ${new Date().toLocaleString()}
`,
  };

  await transporter.sendMail(mailOptions);
};
