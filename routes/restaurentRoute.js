const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createrestaurentController,
  getallrestaurantController,
  getbyIDrestaurantController,
  deleterestaurantController,
  updaterestaurentController,
} = require("../controllers/restaurentController");

const router = express.Router();

router.post("/create", authMiddleware, createrestaurentController);

router.get("/get", getallrestaurantController);

router.get("/get/:id", getbyIDrestaurantController);

router.delete("/delete/:id", authMiddleware, deleterestaurantController);

router.put("/update/:id", authMiddleware, updaterestaurentController);


module.exports = router;
