const mongoose = require("mongoose");
const { json } = require("express");
const Category = require("../models/categoryModel");

exports.createCateController = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const existingCategory = await Category.findOne({
      title: title.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }
    const newCategory = await Category.create({
      title: title.trim(),
      imageUrl,
    });

    res.status(201).json({
      message: "Category created successfully.",
      newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getCateController = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.status(404).json({
        message: "No category available.",
      });
    }
    res.status(200).json({
      totalCount: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getCatebyidController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    res.status(200).json({ message: "Category found.", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.updateCateController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: " Category not found.",
      });
    }

    const { title, imageUrl } = req.body;

    if (title) category.title = title;
    if (imageUrl) category.imageUrl = imageUrl;

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteCateController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const category = await Category.findByIdAndDelete(id)
    if(!category){
        return res.status(404).json({
            message: "Category not found."
        })
    }

    res.status(200).json({ message : "Category deleted successfully."})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
