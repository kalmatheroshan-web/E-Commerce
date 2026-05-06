const orderModel = require('../Models/Order');
const reviewModel = require('../Models/Review');

// Create Review
const mongoose = require('mongoose');
const { uploadToCloudinary } = require('../Services/uploadToCloudinary');

async function createReview(req, res) {
    try {
        const user = req.userId;
        const { review: message, rating, productId: product ,title} = req.body;
        const images = req.files?.images;

        if (!images) {
            return res.status(400).json({ mes: "Image not supported" });
        }

        // Validation
        if (!product || !user) {
            return res.status(400).json({ mes: "Product or user missing" });
        }

        if (!message || !rating) {
            return res.status(400).json({ mes: "Message and rating are required" });
        }

        if (
            !mongoose.Types.ObjectId.isValid(user) ||
            !mongoose.Types.ObjectId.isValid(product)
        ) {
            return res.status(400).json({ mes: "Invalid user or product ID" });
        }

        const order = await orderModel.findOne({ user });

        if (!order) {
            return res.status(403).json({ mes: "No order found for user" });
        }

        // Check if product exists in order
        const hasProduct = order.products.some(item =>
            item.product.equals(product)
        );

        if (!hasProduct) {
            return res.status(403).json({ mes: "Only valid buyer can write" });
        }

        // upload images to cloudinary
        const uploadedImages = await Promise.all(
            images.map(async (file) => {
                const result = await uploadToCloudinary(
                    file,
                    process.env.CLOUDINARY_FOLDER_NAME
                );
                return result.secure_url;
            })
        );

        const review = await reviewModel.create({
            message,
            rating,
            images: uploadedImages,
            user, product,title
        });

        return res.status(201).json({ success: true, review });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
}
// Delete Reviews
async function deleteReview(req, res) {
    try {
        const { id: product } = req.params;
        const review = await reviewModel.findOneAndDelete({ user: req.userId, product });

        if (!review) {
            return res.status(404).json({ msg: "Review not found or unauthorized" });
        }

        return res.status(200).json({
            msg: "Review deleted successfully",
            review
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ mes: 'Server error', error: error.message });
    }

}

// Get Reviews 
async function getProductReviews(req, res) {
    try {
        const { productId: product } = req.body;
        const reviews = await reviewModel.find({ product }).populate('user').populate('product').sort({ createdAt: 1 });;

        return res.status(200).json({ success: true, reviews });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
            error: error.message
        });
    }
}

async function updateReview(req, res) {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

async function getProductRating(req, res) {
    try {

    } catch (error) {
        console.log(error.message);
    }

}

async function getReviews(req, res) {
    try {
        let reviews = await reviewModel.find();
        return res.status(200).send({ reviews });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mes: 'server error' });
    }

}

module.exports = {
    createReview, getProductReviews, getReviews,
    deleteReview, updateReview,
    getProductRating
};