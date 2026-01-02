const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    imageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
