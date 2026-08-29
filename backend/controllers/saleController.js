const Sale = require("../models/Sale");
const Product = require("../models/Product");

// Create Sale
const createSale = async(req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No products in the bill",
            });
        }

        let subtotal = 0;
        const saleItems = [];

        // Check products and stock
        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`,
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            const itemTotal = product.sellingPrice * item.quantity;

            subtotal += itemTotal;

            saleItems.push({
                product: product._id,
                name: product.name,
                price: product.sellingPrice,
                quantity: item.quantity,
                total: itemTotal,
            });
        }

        // Reduce product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product, {
                    $inc: {
                        stock: -item.quantity,
                    },
                }
            );
        }

        // Create sale
        const sale = await Sale.create({
            items: saleItems,
            subtotal,
            total: subtotal,
        });

        res.status(201).json({
            success: true,
            data: sale,
        });

    } catch (error) {
        console.error("Create sale error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all sales
const getSales = async(req, res) => {
    try {
        const sales = await Sale.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: sales.length,
            data: sales,
        });

    } catch (error) {
        console.error("Get sales error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createSale,
    getSales,
};