const mongoose = require("mongoose");
const { json } = require("express");
const Resturant = require("../models/restaurentModel");

exports.createrestaurentController = async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
    } = req.body;

    if (!title || !coords) {
      return res
        .status(400)
        .json({ message: "Please provide title and address" });
    }

    const newRestaurent = await Resturant.create({
      title,
      imageUrl,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
    });

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant: newRestaurent,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

exports.getallrestaurantController = async (req, res) => {
  try {
    const allRestaurents = await Resturant.find();
    if (allRestaurents.length === 0) {
      return res.status(404).json({ message: "No restaurent is available." });
    }

    res.status(200).json({
      totalcount: allRestaurents.length,
      allRestaurents,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getbyIDrestaurantController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "Please provide ID" });
    }
    const restaurant = await Resturant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.status(200).json({ message: "Restaurent found.", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleterestaurantController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Please provide ID" });
    }
    const restaurant = await Resturant.findByIdAndDelete(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res
      .status(200)
      .json({ message: "Restaurent deleted successfully.", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.updaterestaurentController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Resturant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const {
      title,
      imageUrl,
      foods,
      time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
    } = req.body;

    if (title) restaurant.title = title;
    if (imageUrl) restaurant.imageUrl = imageUrl;
    if (foods) restaurant.foods = foods;
    if (time) restaurant.time = time;
    if (pickup !== undefined) restaurant.pickup = pickup;
    if (delivery !== undefined) restaurant.delivery = delivery;
    if (isOpen !== undefined) restaurant.isOpen = isOpen;
    if (logoUrl) restaurant.logoUrl = logoUrl;
    if (rating !== undefined) restaurant.rating = rating;
    if (ratingCount !== undefined) restaurant.ratingCount = ratingCount;
    if (code) restaurant.code = code;
    if (coords) restaurant.coords = coords;

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
