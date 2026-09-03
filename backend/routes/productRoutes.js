const express = require("express");

const {
    createProduct,
    getProducts,
    updateProduct,
    restockProduct,
    deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.route("/")
    .post(createProduct)
    .get(getProducts);

router.route("/:id/restock")
    .put(restockProduct);

router.route("/:id")
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;