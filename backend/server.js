const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

connectDB();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

//Test Route
app.get("/", (req, res) => {
    res.send("Inventory Management API is Running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});