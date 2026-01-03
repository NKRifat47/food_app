const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const Restaurant = require("../models/restaurentModel");
const Food = require("../models/foodModel");

exports.createFoodController = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      category,
      restaurant,
      code,
      isAvailable,
      rating,
      ratingCount,
    } = req.body;

    if (!title || !description || !price || !category || !restaurant) {
      return res.status(400).send({
        message: "Please provide all details.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(category) ||
      !mongoose.Types.ObjectId.isValid(restaurant)
    ) {
      return res.status(400).json({
        message: "Invalid category or restaurant ID",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        message: "Category not found.",
      });
    }

    const restaurentExists = await Restaurant.findById(restaurant);
    if (!restaurentExists) {
      return res.status(400).json({
        message: "Restaurent not found.",
      });
    }

    const food = await Food.create({
      title,
      description,
      price,
      imageUrl,
      category,
      restaurant,
      code,
      isAvailable,
      rating,
      ratingCount,
    });

    res.status(201).json({
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getFoodController = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("category", "title imageUrl")
      .populate("restaurant", "title imageUrl isOpen");

    if (foods.length === 0) {
      return res.status(404).json({
        message: "No foods found",
      });
    }

    res.status(200).json({
      success: true,
      totalFoods: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getSingleFoodController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Food ID is Invalid.",
      });
    }

    const food = await Food.findById(id)
      .populate("category", "title imageUrl")
      .populate("restaurant", "title imageUrl isOpen");

    if (!food) {
      return res.status(404).json({
        message: "Food not found.",
      });
    }

    res.status(200).json({
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getFoodsByRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Restaurant ID is Invalid.",
      });
    }

    const foods = await Food.find({ restaurant: id })
      .populate("category", "title imageUrl")
      .populate("restaurant", "title imageUrl isOpen");

    if (foods.length === 0) {
      return res.status(404).json({
        message: "No Food found in the restaurent.",
      });
    }

    res.status(200).json({
      total_Foods: foods.length,
      foods,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.updateFoodController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid food ID.",
      });
    }

    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        message: "Food not found.",
      });
    }

    const {
      title,
      description,
      price,
      imageUrl,
      category,
      restaurant,
      code,
      isAvailable,
      rating,
      ratingCount,
    } = req.body;

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }

      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          message: "Category not found.",
        });
      }
      food.category = category;
    }

    if (restaurant) {
      if (!mongoose.Types.ObjectId.isValid(restaurant)) {
        return res.status(400).json({
          message: "Invalid restaurant ID.",
        });
      }

      const restaurentExists = await Restaurant.findById(restaurant);
      if (!restaurentExists) {
        return res.status(404).json({
          message: "Restaurent not found.",
        });
      }
      food.restaurant = restaurant;
    }

    if (title) food.title = title;
    if (description) food.description = description;
    if (price !== undefined) food.price = price;
    if (imageUrl) food.imageUrl = imageUrl;
    if (code) food.code = code;
    if (isAvailable !== undefined) food.isAvailable = isAvailable;
    if (rating !== undefined) food.rating = rating;
    if (ratingCount !== undefined) food.ratingCount = ratingCount;

    await food.save();

    res.status(200).json({
      message: "Food updated successfully.",
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteFoodController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid food ID.",
      });
    }

    const food = await Food.findByIdAndDelete(id);
    if (!food) {
      return res.status(404).json({
        message: "Food not found.",
      });
    }

    res.status(200).json({
      message: "Food deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
 