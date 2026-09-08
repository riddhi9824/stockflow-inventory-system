const Supplier = require("../models/Supplier");

//Create Supplier
const createSupplier = async(req, res) => {
    try {
        const { name, phone, email, address } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Supplier name and phone are required",
            })
        }

        const supplier = await Supplier.create({
            name,
            phone,
            email,
            address,
        });

        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            data: supplier,
        });
    } catch (error) {
        console.error("Create supplier error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Get all suppliers
const getSuppliers = async(req, res) => {
    try {
        const suppliers = await Supplier.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: suppliers.length,
            data: suppliers,
        });
    } catch (error) {
        console.error("Get suppliers error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Update supplier
const updateSupplier = async(req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true,
                runValidators: true,
            }
        );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            data: supplier,
        });
    } catch (error) {
        console.error("Update supplier error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Delete supplier
const deleteSupplier = async(req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Supplier deleted successfully",
        });
    } catch (error) {
        console.error("Delete supplier error");

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier,
};