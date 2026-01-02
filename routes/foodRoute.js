const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createFoodController,
  getFoodController,
  getSingleFoodController,
  getFoodsByRestaurantController,
  updateFoodController,
  deleteFoodController,
} = require("../controllers/foodController");

router.post("/create", authMiddleware, createFoodController);

router.get("/get", getFoodController);

router.get("/get/:id", getSingleFoodController);

router.get("/getbyrestaurant/:id", getFoodsByRestaurantController);

router.put("/update/:id", authMiddleware, updateFoodController);

router.delete("/delete/:id", authMiddleware, deleteFoodController);

module.exports = router;
