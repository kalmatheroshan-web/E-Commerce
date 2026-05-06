const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,   // AUTO convert to uppercase
        trim: true
    },

    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true
    },

    discountValue: {
        type: Number,
        required: true
    },

    minOrderAmount: {
        type: Number,
        default: 0
    },

    maxDiscount: {
        type: Number,   // useful for percentage coupons
        default: null
    },

    expiryDate: {
        type: Date,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

const couponModel =  mongoose.model("Coupon", couponSchema);
module.exports = couponModel;