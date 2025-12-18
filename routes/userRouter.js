const express = require("express");
const {
  getuserController,
  updateuserController,
  updatepasswordController,
  deleteuserController,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/getuser", authMiddleware, getuserController);

router.post("/updateuser", authMiddleware, updateuserController);

router.post("/updatepassword", authMiddleware, updatepasswordController);

router.delete("/deleteuser", authMiddleware, deleteuserController);

module.exports = router;
