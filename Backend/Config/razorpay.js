const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();

var instance = new Razorpay({
    key_id: process.env.RAZOR_KEY,
    key_secret: process.env.RAZOR_SECRET,
});

module.exports = instance;