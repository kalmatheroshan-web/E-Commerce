const otpModel = require("../Models/Otp");
const userModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

async function sendOtp(req, res) {
    try {
        const { email } = req.body;

        // 6 random digit otp
        const otp = Math.floor(100000 + Math.random() * 900000);

        // send otp to email
        await otpModel.create({ email, otp });
        console.log(otp);

        res.status(200).send({ mes: 'otp send successfullly', otp });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
}

async function verify_otp(req, res) {
    const { email, otp } = req.body;
    let otp_verify = await otpModel.findOne({ email }).sort({ createdAt: -1 }).limit(1);

    if (otp_verify?.otp != otp) {
        return res.status(404).send({ mes: 'Invalid Otp entered' });
    }
    const user = await userModel.findOne({ email }).populate("cart.product");

    // Generate JWT token
    const token = jwt.sign({ id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );

    // Set cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production (https)
    });

    return res.status(200).json({
        mes: "User logged in successfully",
        user, token
    });

}

// normal signup
async function signUp(req, res) {
    try {

        let { email, password, firstName, lastName, accountType } = req.body;

        //check already exist 
        const found = await userModel.findOne({ email });
        console.log('found ', found);
        if (found) {
            return res.status(409).send({
                mes: "User already exists, please try another"
            });
        }

        const image = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName)} ${encodeURIComponent(lastName)}`;


        // hash the password
        password = await bcrypt.hash(password, 10);
        console.log('hello be');

        // create user
        let user = await userModel.create({ email, password, firstName, lastName, image, accountType: null ? "customer" : accountType });

        if (user) {
            return res.status(201).send({
                mes: "User created successfully",
                user
            });
        }

        return res.status(500).send({
            mes: "Internal server error"
        })

    } catch (error) {
        console.log(error.message);
    }
}

// login
async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                mes: "User not found"
            });
        }

        // Check password first
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                mes: "Incorrect password"
            });
        }

        //sendOtp
        // 6 random digit otp
        const otp = Math.floor(100000 + Math.random() * 900000);

        // send otp to email
        await otpModel.create({ email, otp });
        console.log("OTP : ", otp);

        // Send response
        return res.status(200).json({
            mes: "OTP sent to your email",
            email: user.email
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            mes: "Internal Server error"
        });
    }
}

//change password
async function changePassword(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ mes: 'invalid email id sent' });
        }

        user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.status(200).json({ mes: 'password change successfully', user });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            error: error.message,
            mes: 'internal server error'
        })
    }
}

module.exports = {
    signUp, verify_otp,
    login, sendOtp, changePassword
}