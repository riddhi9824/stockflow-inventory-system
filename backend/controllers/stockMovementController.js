const StockMovement = require("../models/StockMovement");

//Get all stock movements
const getStockMovements = async(req, res) => {
    try {
        const movements = await StockMovement.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: movements.length,
            data: movements,
        });
    } catch (error) {
        console.error("Get stock movements error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getStockMovements,
};