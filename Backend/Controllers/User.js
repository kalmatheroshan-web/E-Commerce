const couponModel = require("../Models/Coupon");
const productModel = require("../Models/Product");
const userModel = require("../Models/User");
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const orderModel = require("../Models/Order");
dotenv.config();

var razorpay = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET,
});

async function addToCart(req, res) {
    try {
        const { size, id: productId } = req.body;
        const userId = req.userId;

        // validate productId
        if (!productId) {
            return res.status(400).json({ mes: "Product ID is required" });
        }

       
        const user = await userModel.findById(userId);
        const product = await productModel.findById(productId);

        if (!user) {
            return res.status(404).json({ mes: "User not found" });
        }

        if (!product) {
            return res.status(404).json({ mes: "Product not found" });
        }
        // find size index
        const sizeIndex = product.sizes.findIndex((item) => item.size === size);

        if (sizeIndex === -1) {
            return res.status(404).json({ mes: "Size not available" });
        }

        // check stock
        if (product.sizes[sizeIndex].quantity <= 0) {
            return res.status(200).json({ mes: "Out of stock" });
        }

        // reduce stock
        product.sizes[sizeIndex].stock -= 1;

        // find product in cart
        const cartIndex = user.cart.findIndex(
            (item) => {
                return item.product.toString() == productId.toString()
            }
        );

        if (cartIndex !== -1 && user.cart[cartIndex].size == size) {
            user.cart[cartIndex].quantity += 1;
        } else {
            user.cart.push({
                product: productId,
                quantity: 1,
                size: size,
            });
        }

        await product.save();
        await user.save();

        return res.status(200).json({
            mes: "Product added to cart",
            cart: user.cart, user: user.populate('cart.product')
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mes: "Internal Server error",
        });
    }
}

async function decreaseCartQuantity(req, res) {
    try {
        const { size, productId } = req.body;
        const userId = req.userId;

        // validate productId
        if (!productId) {
            return res.status(400).json({ mes: "Product ID is required" });
        }

        if (!size) {
            return res.status(400).json({ mes: "Size is required" });
        }

        const user = await userModel.findById(userId);
        const product = await productModel.findById(productId);

        if (!user) {
            return res.status(404).json({ mes: "User not found" });
        }
        // find size index
        const sizeIndex = product.sizes.findIndex((item) => item.size === size);

        if (sizeIndex === -1) {
            return res.status(404).json({ mes: "Size not available" });
        }

        // increase stock
        product.sizes[sizeIndex].stock += 1;

        // find product in cart
        const cartIndex = user.cart.findIndex(
            (item) => item.product.toString() === productId.toString()
        );

        if (cartIndex !== -1 && user.cart[cartIndex].size == size) {
            user.cart[cartIndex].quantity -= 1;
            if (user.cart[cartIndex].quantity <= 0) {
                user.cart = user.cart.filter((_, inx) => inx != cartIndex);
            }
        }

        await product.save();
        await user.save();

        return res.status(200).json({
            mes: "Product added to cart",
            cart: user.cart,
            user: user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mes: "Internal Server error",
        });
    }
}

async function removeFromCart(req, res) {
    try {
        const { productId, stock, size } = req.body;
        const userId = req.userId;

        if (!productId) {
            return res.status(400).json({ mes: "Product ID is required" });
        }

        const user = await userModel.findByIdAndUpdate(userId, {
            $pull: { cart: { product: productId } }
        }, { new: true }).populate("cart.product");

        if (!user) {
            return res.status(404).json({ mes: "User not found" });
        }

        const product = await productModel.findById(productId);
        const index = product.sizes.findIndex(item => item.size == size);
        product.sizes[index].stock += Number(stock);

        await product.save();

        res.send({ mes: 'remove item from cart', user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            mes: "Internal Server error",
        });
    }
}


async function viewCart(req, res) {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId)
            .populate('cart.product');

        if (!user) return res.status(404).json({ mes: "User not found" });
        res.status(200).json({
            data: user.cart,
            user
        })

    } catch (error) {
        console.log(err.message);
        return res.status(500).json({
            mes: "Internal Server error"
        });
    }
}

async function updateCart(req, res) {
    try {
        const { id: productId, mark } = req.params;
        const user = await userModel.findById(req.userId);

        const item = user.cart.find(
            i => i.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ mes: "Product not in cart" });
        }

        item.quantity += Number(mark);

        // Remove if quantity <= 0
        user.cart = user.cart.filter(i => i.quantity > 0);

        await user.save();

        res.status(200).json({
            mes: "Cart updated successfully",
            user
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ mes: "Internal Server error" });
    }
}

async function editProfile(req, res) {
    try {
        const userId = req.userId;

        // Allow only specific fields to be updated
        const allowedUpdates = ["firstName", "lastName", "email", "image", "addresses"];
        const updates = {};

        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Check if no valid fields provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).send({
                success: false,
                message: "No valid fields to update",
            });
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).send({
            success: true,
            user
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    addToCart, removeFromCart,
    editProfile, viewCart,
    updateCart,decreaseCartQuantity
};