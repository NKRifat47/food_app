const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getuserController = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.updateuserController = async (req, res) => {
  try {
    // find user
    const user = await User.findById(req.user.id);
    //validation
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    //update
    const { userName, address, phone } = req.body;
    if (userName) user.userName = userName;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    //save user
    await user.save();
    res.status(200).json({
      message: "User Updated SUccessfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
};

exports.updatepasswordController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "Usre Not Found",
      });
    }

    const { oldpassword, newpassword } = req.body;
    if (!oldpassword || !newpassword) {
      return res.status(400).json({
        message: "Provide Oldpassword and Newpassword",
      });
    }

    const matched = await bcrypt.compare(oldpassword, user.password);
    if (!matched) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newpassword, salt);
    user.password = hashPassword;
    await user.save();
    res.status(200).json({
      message: "Password Updated",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
};

exports.deleteuserController = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
