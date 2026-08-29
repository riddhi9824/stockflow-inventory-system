const express = require("express");

const router = express.Router();

const {
    createSale,
    getSales,
} = require("../controllers/saleController");

//Create a new sale
router.post("/", createSale);

//Get all sales
router.get("/", getSales);

module.exports = router;