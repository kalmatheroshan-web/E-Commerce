const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  images: [String],
  title: { type: String },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);