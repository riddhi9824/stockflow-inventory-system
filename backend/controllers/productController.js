const Product = require("../models/Product");

//Create Product
const createProduct = async(req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

//Get all products
const getProducts = async(req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Update Product
const updateProduct = async(req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    updateProduct,
};