const productModel = require("../Models/Product");

async function searchResult(req, res) {
    try {
        const { search } = req.body;
        const products = await productModel.find({
            $text: { $search: search }
        }).populate('category');

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            mes: error.message,
            error: 'Internal server error'
        });
    }
}

module.exports = { searchResult }