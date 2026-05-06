const jwt = require('jsonwebtoken');
const userModel = require('../Models/User');
require('dotenv').config();


function Auth(req, res, next) {
    const token = req.cookies?.token || req.body?.token
        || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) { return res.status(401).json({ message: "Unauthorized pass the token" }); }
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = id;
        next();
    }
    catch (err) {
        console.log(err.message);
        res.status(404).send({ error: err.message, mes: 'Wrong token passed' });
    }

}

async function isAdmin(req, res, next) {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.accountType == 'admin') {
            return next();
        }


        return res.status(403).send({ message: "Admin access only" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

async function isSeller(req, res, next) {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.accountType === 'seller') {
            return next();
        }

        return res.status(403).send({ message: "Seller access only" });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

async function isSellerOrAdmin(req, res, next) {
    const user = await userModel.findById(req.userId);

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    if (user.accountType === 'seller' || user.accountType === "admin") {
        return next();
    }
    return res.status(403).json({ message: "Access denied" });
};
module.exports = { Auth, isSeller, isAdmin, isSellerOrAdmin };