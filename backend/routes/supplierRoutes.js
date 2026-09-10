const express = require("express");

const {
    createSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier,
    getSupplierPerformance,
} = require("../controllers/supplierController");

const router = express.Router();

router
    .route("/")
    .post(createSupplier)
    .get(getSuppliers);

router.get("/performance", getSupplierPerformance);
router
    .route("/:id")
    .put(updateSupplier)
    .delete(deleteSupplier);

module.exports = router;