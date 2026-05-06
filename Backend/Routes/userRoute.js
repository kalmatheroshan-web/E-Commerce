const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const { Auth } = require("../Middlewares/Auth");
const { signUp, verify_otp, login, sendOtp, changePassword } = require('../Controllers/Authenction');
const { addToCart, removeFromCart, updateCart, viewCart, decreaseCartQuantity, editProfile } = require("../Controllers/User");
const { viewOrders, placeOrder, verify_payment, createOrder, updateStatus } = require('../Controllers/Order');
const { viewCoupon } = require("../Controllers/Category");

/* ================= AUTH ROUTES ================= */
userRouter.post('/signUp', signUp);
userRouter.post('/login', login);
userRouter.post('/verify', verify_otp)
userRouter.post('/sendOtp', sendOtp);
userRouter.post('/changePassword', changePassword);

/* ================= CART ROUTES ================= */
userRouter.post('/add', Auth, addToCart);
userRouter.get('/get', Auth, viewCart);
userRouter.delete('/remove', Auth, removeFromCart);
userRouter.put('/update/:id/:mark', Auth, updateCart);
userRouter.put('/decrease', Auth, decreaseCartQuantity);

/* ================= ORDER ROUTES ================= */
userRouter.post('/create-order', Auth, createOrder);
userRouter.post('/verify-payment', Auth, verify_payment);
userRouter.post('/place-order', Auth, placeOrder);
userRouter.get('/view-order', Auth, viewOrders);
userRouter.post('/update-status', Auth, updateStatus);


/* ================= USER ROUTES ================= */
userRouter.patch('/edit-profile', Auth, editProfile);
userRouter.get('/coupon', Auth, viewCoupon);
userRouter.put('/edit-address', Auth, editProfile);

/* ================= GOOGLE AUTH ================= */
userRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: 'http://localhost:5173/'
}));


module.exports = userRouter;