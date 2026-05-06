const orderModel = require("../Models/Order");
const razorpay = require("../Config/razorpay");
const crypto = require("crypto");
const { success } = require("zod");
const userModel = require("../Models/User");

async function createOrder(req, res) {
    try {
        const { total } = req.body;

        const options = {
            amount: total * 100, // amount in paise (₹ total * 100)
            currency: "INR",
            receipt: "receipt_order_1"
        };

        const order = await razorpay.orders.create(options);
        res.status(200).send({ success: true, order });
    } catch (err) {
        res.status(500).send(err);
    }
}

async function verify_payment(req, res) {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZOR_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
}

async function placeOrder(req, res) {
    try {
        const user = req.userId;
        const orderData = req.body;
 
        let products = orderData.items.map((item) => {
            return {
                product: item.product._id,
                quantity: item.quantity
            }
        })
        let totalAmount = Number(orderData.totalAmount);

        let paymentMethod = orderData.paymentMethod;
        let transactionId = null;
        let paymentStatus = "Pending";

        if (paymentMethod == "online") {
            transactionId = req.body.paymentId;
            paymentStatus = "Completed"
        }

        const order = await orderModel.create({
            user,
            products,
            totalAmount,
            paymentStatus,
            paymentMethod,
            transactionId
        })

        const userData = await userModel.findByIdAndUpdate(user, { $set: { cart: [] } });

        return res.status(200).send({
            mes: 'order send successfully',
            order, user: userData
        })

    } catch (error) {
        console.log(error.message);
    }
}

async function viewOrders(req, res) {
    try {
        const orders = await orderModel
            .find({ user: req.userId })
            .populate('products.product')
            .sort({ createdAt: -1 });

        // Handle case where user has no orders
        if (!orders || orders.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No orders found",
                response: []
            });
        }

        return res.status(200).send({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Order Fetch Error:", error.message);
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function updateStatus(req, res) {
    try {
        const { orderId, status } = req.body;

        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).send({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Order status updated successfully',
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        })
    }
}
module.exports = { createOrder, placeOrder, verify_payment, updateStatus, viewOrders };