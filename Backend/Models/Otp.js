const mongoose = require('mongoose');

const otp_schema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        require: true
    },
    otp: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: (5 * 60 + 20) // Time in seconds (5 Minutes+)
    }
});


const otpModel = mongoose.model('OTP', otp_schema);

module.exports = otpModel;