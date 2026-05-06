const express = require('express');
const { Auth, isSellerOrAdmin, isAdmin } = require('../Middlewares/Auth');
const { createCategory, viewCategory, deleteCategory, createCoupon, deleteCoupon } = require('../Controllers/Category');
const { viewCoupon } = require('../Controllers/Category');
const categoryRouter = express.Router();

categoryRouter.post('/create', Auth, isAdmin, createCategory);
categoryRouter.get('/read',Auth, isSellerOrAdmin, viewCategory);
categoryRouter.delete('/delete',Auth, isSellerOrAdmin, deleteCategory);

categoryRouter.get('/view-coupons', Auth, viewCoupon);
categoryRouter.post('/create-coupons', Auth, isAdmin, createCoupon);
categoryRouter.delete('/delete-coupons', Auth, isAdmin, deleteCoupon);

module.exports = categoryRouter; 