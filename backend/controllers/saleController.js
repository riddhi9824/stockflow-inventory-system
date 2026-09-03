const Sale = require("../models/Sale");
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

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
                costPrice: product.costPrice,
                quantity: item.quantity,
                total: itemTotal,
            });
        }

        // Reduce product stock and record stock movement
        for (const item of items) {
            const product = await Product.findById(item.product);

            const previousStock = product.stock;
            const newStock = previousStock - item.quantity;

            product.stock = newStock;

            await product.save();

            await StockMovement.create({
                product: product._id,
                productName: product.name,
                type: "SALE",
                quantity: item.quantity,
                previousStock,
                newStock,
            });
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

        const salesWithCostPrice = await Promise.all(
            sales.map(async(sale) => {
                const updatedItems = await Promise.all(
                    sale.items.map(async(item) => {
                        //New sales already have costPrice
                        if (item.costPrice !== undefined) {
                            return item;
                        }

                        //Older sales don't have costPrice
                        const product = await Product.findById(item.product)
                            .select("costPrice");

                        return {
                            ...item.toObject(),
                            costPrice: product ? product.costPrice : 0,
                        };
                    })
                );

                return {
                    ...sale.toObject(),
                    items: updatedItems,
                };
            })
        );

        res.status(200).json({
            success: true,
            count: salesWithCostPrice.length,
            data: salesWithCostPrice,
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