const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerController = async (req, res) => {
  try {
    const { userName, email, password, phone, address } = req.body;
    if (!userName || !email || !password || !phone) {
      return res.status(400).json({
        message: "Please fill up all field.",
      });
    }

    const existuser = await User.findOne({ email });
    if (existuser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newuser = await User.create({
      userName,
      email,
      password: hashPassword,
      phone,
      address,
    });
    res.status(201).json({ message: "User registered successfully.", newuser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({
        message: "Enter Email and Password.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
