const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    address: {
      type: Array,
    },
    phone: {
      type: Number,
      required: [true, "Phone numnber is reuired."],
    },
    usertype: {
      type: String,
      required: [true, "User type is required."],
      default: "client",
      enum: ["client", "admin", "vendor", "driver"],
    },
    profile: {
      type: String,
      default: "https://cdn-icons-png.freepik.com/512/10337/10337609.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema)
