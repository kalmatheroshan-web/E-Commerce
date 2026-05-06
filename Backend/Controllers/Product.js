const orderModel = require("../Models/Order");
const productModel = require("../Models/Product");
const bannerModel = require('../Models/Banner');
const { uploadToCloudinary } = require("../Services/uploadToCloudinary");

// for the sellers
async function createProduct(req, res) {
    try {
        let {
            productName,
            description,
            price,
            discount,
            category,
            sizes = '[]',
        } = req.body;

        // sizes will be string (from FormData)
        if (sizes) {
            sizes = JSON.parse(sizes);
        }

        // validation
        if (
            !productName ||
            !description ||
            price == null ||
            discount == null ||
            !category ||
            !Array.isArray(sizes)
        ) {
            return res.status(400).send({
                message: "Please enter all required fields",
            });
        }

        const { images } = req.files;

        if (!images || images.length < 4) {
            return res.status(400).send({
                message: "Minimum 4 images required",
            });
        }

        // upload images to cloudinary
        const uploadedImages = await Promise.all(
            images.map(async (file) => {
                const result = await uploadToCloudinary(
                    file,
                    process.env.CLOUDINARY_FOLDER_NAME
                );
                return result.secure_url;
            })
        );

        // save product in DB
        const product = await productModel.create({
            productName,
            description,
            price: Number(price),
            discount: Number(discount),
            category,
            sizes,
            images: uploadedImages,
            createdBy: req.userId,
        });

        return res.status(201).send({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).send({
            message: error.message || "Internal Server Error",
        });
    }
}

async function updateProduct(req, res) {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        // prevent empty update
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No fields provided to update"
            });
        }

        // OPTIONAL: whitelist allowed fields (very important)
        const allowedFields = [
            "productName",
            "description",
            "price",
            "discount",
            "category",
            "sizes",
            "images"
        ];

        const updateData = {};

        for (let key of Object.keys(req.body)) {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        }

        const product = await productModel.findByIdAndUpdate(
            productId,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
}

async function deleteProduct(req, res) {
    try {
        const { productId } = req.body;

        // validation (only check required fields if needed)
        if (!productId) {
            return res.status(400).send({
                message: "Product ID is required"
            });
        }

        // delete product
        const product = await productModel.findByIdAndDelete(productId, { returnDocument: 'after' });

        if (!product) {
            return res.status(404).send({
                mes: 'product not found'
            })
        }
        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
            product
        })

    } catch (error) {
        console.log(error.message);

        return res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

async function getAllSellerProducts(req, res) {
    try {
        const products = await productModel.find({ createdBy: req.userId }).populate('category');

        if (!products)
            return res.status(404).send({ mes: "There is no Product for sell" });
        return res.status(200).send({ success: true, products });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error"
        })
    }
}


// for the user 
async function getAllProducts(req, res) {
    try {
        const products = await productModel.find().populate('category');

        if (!products)
            return res.status(404).send({ mes: "There is no Product for sell" });
        return res.status(200).send({ success: true, products });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error"
        })
    }
}

async function getProductByCat(req, res) {
    try {
        const { catId } = req.body;

        const products = await productModel.find({ category: catId }).populate('category');

        if (!products) {
            return res.status(404).send({
                message: "No products found"
            })
        }

        res.status(200).send({
            mes: 'Data got successfully',
            data: products
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message || "Internal Server Error"
        })
    }
}

async function getAllOrders(req, res) {
    try {
        const orders = await orderModel.find().populate('products.product').populate('user');

        let data = orders.filter(item => item.products.filter(ele => ele.createdBy == req.userId));

        res.status(200).send({
            success: true,
            orders: orders
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

async function createBanner(req, res) {
    try {
        const banner = await bannerModel.create(req.body);
        res.status(200).send({
            success: true,
            banner: banner
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error"
        })
    }
}

async function showBanner(req, res) {
    try {
        const banner = await bannerModel.find().limit(6);
        return res.status(200).json({
            success: true,
            banner: banner
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}

module.exports = {
    createProduct, updateProduct, deleteProduct,
    getProductByCat, getAllProducts, getAllOrders, getAllSellerProducts
}