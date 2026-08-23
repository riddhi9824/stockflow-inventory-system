const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProducts,
    updateProduct,
} = require("../controllers/productController");

router.route("/")
    .post(createProduct)
    .get(getProducts);

router.route("/:id")
    .put(updateProduct);
module.exports = router;