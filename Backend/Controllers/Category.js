const { success } = require("zod");
const categoryModel = require("../Models/Category");
const couponModel = require("../Models/Coupon");

async function createCategory(req, res) {
    try {
        const { categoryName, parentId = null } = req.body;

        // Basic validation
        if (!categoryName) {
            return res.status(400).json({ mes: "Category name is required" });
        }

        // check duplicate
        const existing = await categoryModel.findOne({ categoryName });
        if (existing) {
            return res.status(409).json({ mes: "Category already exists" });
        }

        const category = await categoryModel.create({
            categoryName,
            parentCategory: parentId || null,
        });

        res.status(201).json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error("Create Category Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            mes: "Internal server error",
        });
    }
}

async function viewCategory(req, res) {
    try {
        const categories = await categoryModel
            .find()
            .populate('parentCategory')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function viewCoupon(req, res) {
    try {
        const now = new Date();

        const coupons = await couponModel.find({
            isActive: true,
            expiryDate: { $gte: now }
        }).sort({ expiryDate: 1 });

        return res.status(200).json({
            success: true,
            count: coupons.length,
            data: coupons
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function createCoupon(req, res) {
    try {
        const { code, discountValue, expiryDate, isActive, discountType } = req.body;

        const coupon = await couponModel.create({
            code,
            discountValue,
            discountType,
            isActive,
            expiryDate: expiryDate ? new Date(expiryDate) : null, // safer handling
        });

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


async function deleteCategory(req, res) {
    try {
        const { categoryId } = req.body;

        const category = await categoryModel.findByIdAndDelete(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Internal Server Error"
        })
    }
}

async function deleteCoupon(req, res) {
    try {
        await couponModel.findByIdAndDelete(req.body.couponId);
        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Internal Server Error"
        })
    }
}


module.exports = {
    createCategory, viewCategory, viewCoupon,
    deleteCategory, createCoupon, deleteCoupon
}