const mongoose = require('mongoose');
const sendMail = require('../services/sendmail');
const otp_html = require('../config/mails html/otp_html');

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

otp_schema.pre("save", async function () {
    if (!this.email || !this.otp) {
        throw new Error("Email and OTP are required");
    }

    await sendMail(
        this.email,
        "OTP Verification !!",
        `Your OTP is ${this.otp}`,
        otp_html(this.otp)
    );
});

const otpModel = mongoose.model('OTP', otp_schema);

module.exports = otpModel;