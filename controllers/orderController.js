const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Food = require("../models/foodModel");

exports.createOrderController = async (req, res) => {
  try {
    const { user, restaurant, items } = req.body;

    if (!user || !restaurant || !items || items.length === 0) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.food || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          message: "Invalid order item",
        });
      }

      const food = await Food.findById(item.food);
      if (!food) {
        return res.status(404).json({
          message: "Food not found",
        });
      }

      const itemTotal = food.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        food: food._id,
        quantity: item.quantity,
        price: food.price, // snapshot
      });
    }

    const order = await Order.create({
      user,
      restaurant,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR =>", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const allowedStatus = ["pending", "preparing", "delivered", "cancelled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be updated",
      });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR =>", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "userName email usertype")
      .populate("restaurant", "title")
      .populate("items.food", "title price");

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("ADMIN GET ORDERS ERROR =>", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
