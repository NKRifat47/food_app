const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  createCateController,
  updateCateController,
  getCateController,
  deleteCateController,
  getCatebyidController,
} = require("../controllers/categoryController");

router.post("/create", authMiddleware, createCateController);

router.get("/get", getCateController);

router.get("/get/:id", getCatebyidController);

router.put("/update/:id", authMiddleware, updateCateController);

router.delete("/delete/:id", authMiddleware, deleteCateController);

module.exports = router;
