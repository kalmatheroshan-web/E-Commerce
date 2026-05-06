const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    sizes: {
        type: [
            {
                size: String,
                stock: Number
            },
        ],
        default: []
    },

    images: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length >= 4;
            },
            message: "Minimum 4 images required"
        }
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

const productModel = new mongoose.model("Product", productSchema);

module.exports = productModel;