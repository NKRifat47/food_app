const mongoose = require("mongoose");

const resturantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Restaurant title is required"],
    },
    imageUrl: String,
    foods: [{ type: String }],
    time: String,
    pickup: { type: Boolean, default: true },
    delivery: { type: Boolean, default: true },
    isOpen: { type: Boolean, default: true },
    logoUrl: String,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    code: String,
    coords: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      latitudeDelta: Number,
      longitudeDelta: Number,
      address: { type: String, required: true },
      title: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resturant", resturantSchema);
