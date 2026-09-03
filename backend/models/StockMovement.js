const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    productName: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: ["RESTOCK", "SALE"],
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
        min: 1,
    },

    previousStock: {
        type: Number,
        required: true,
        min: 0,
    },

    newStock: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("StockMovement", stockMovementSchema);