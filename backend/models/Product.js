const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    sku: {
        type: String,
        required: true,
        unique: true,
    },

    barcode: {
        type: String,
        default: "",
    },

    category: {
        type: String,
        required: true,
    },

    costPrice: {
        type: Number,
        required: true,
        min: 0,
    },

    sellingPrice: {
        type: Number,
        required: true,
        min: 0,
    },

    stock: {
        type: Number,
        required: true,
        default: 0,
    },

    lowStockAlert: {
        type: Number,
        default: 5,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);