const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Banner image URL is required"],
    },
    // Determines where the user goes when clicking the banner
    linkType: {
      type: String,
      enum: ["product", "category", "external", "none"],
      default: "none",
    },
    // Reference ID for products or categories
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "linkPath", // Dynamic reference
    },
    // Helper for the refPath above
    linkPath: {
      type: String,
      enum: ["Product", "Category"],
      required: function () {
        return this.linkType === "product" || this.linkType === "category";
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      default: 0, // Higher numbers appear first in the Swiper
    },
    // For seasonal sales (Auto-show/hide)
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);