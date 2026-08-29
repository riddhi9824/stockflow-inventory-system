const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    quantity: {
        type: Number,
        required: true,
        min: 1,
    },

    total: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: false });

const saleSchema = new mongoose.Schema({
    items: {
        type: [saleItemSchema],
        required: true,
        validate: {
            validator: (items) => items.length > 0,
            message: "Sale must contain at least one product",
        },
    },

    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },

    total: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Sale", saleSchema);