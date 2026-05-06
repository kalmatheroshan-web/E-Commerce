const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    addresses: [
        {
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: { type: String, default: 'India' }
        }
    ],
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 },
            size: { type: String }
        }
    ],
    accountType: {
        type: String,
        enum: ["customer", "admin", "seller", "delivery"],
        default: "customer"
    }
}, { timestamps: true });


const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;