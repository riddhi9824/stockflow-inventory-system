import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { getSales } from "../services/saleService";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sales, setSales] = useState([]);
    const [restockProductId, setRestockProductId] = useState(null);
    const [restockQuantity, setRestockQuantity] = useState("");

    const today = new Date().toLocaleDateString();

    const todaySales = sales.filter(
        (sale) => 
            new Date(sale.createdAt).toLocaleDateString() === today
    );

    const todayRevenue = todaySales.reduce(
        (total, sale) => total + sale.total,
        0
    );

    const todayProfit = todaySales.reduce(
        (total, sale) =>
            total +
            sale.items.reduce(
                (itemTotal, item) => 
                    itemTotal + 
                    ((item.price - item.costPrice) * item.quantity),
                0
            ),
        0
    );

    const totalProducts = products.length;

    const totalStock = products.reduce(
        (total, product) => total + product.stock,
        0
    );

    const lowStockProducts = products.filter(
        (product) => product.stock <= product.lowStockAlert
    ).length;

    const inventoryValue = products.reduce(
        (total, product) => total + (product.costPrice * product.stock),
        0
    );

    const totalRevenue = sales.reduce(
        (total, sale) => total + sale.total,
        0
    );

    const productsSold = sales.reduce(
        (total, sale) =>
            total + 
            sale.items.reduce(
                (itemTotal, item) => itemTotal + item.quantity,
                0
            ),
        0
    );

    const totalProfit = sales.reduce(
    (total, sale) =>
        total +
        sale.items.reduce(
            (itemTotal, item) => {
                console.log("Sale item:", item);
                console.log("Cost Price:", item.costPrice);
                
                return itemTotal +
                    ((item.price - item.costPrice) * item.quantity);
            },
            0
        ),
    0
);

const revenueTrendData = sales
    .reduce((data, sale) => {
        const date = new Date(sale.createdAt).toLocaleDateString();

        const existingDate = data.find(
            (item) => item.date === date
        );

        if(existingDate) {
            existingDate.revenue += sale.total;
        } else {
            data.push({
                date,
                revenue: sale.total,
            });
        }

        return data;
    }, [])
    .sort(
        (a, b) =>
            new Date(a.date) - new Date(b.date)
    );

const topSellingProducts =sales
    .reduce((data, sale) => {
        sale.items.forEach((item) => {
            const existingProduct = data.find(
                (product) => product.name === item.name
            );

            if(existingProduct) {
                existingProduct.quantity += item.quantity;
            } else {
                data.push({
                    name: item.name,
                    quantity: item.quantity,
                });
            }
        });

        return data;
    }, [])
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

const filteredProducts = products.filter((product) => 
       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

useEffect(() => {
        fetchProducts();
        fetchSales();
}, []);

const fetchProducts = async () => {
    try {
        const response = await getProducts();

        console.log("PRODUCT API RESPONSE:", response);
        console.log("PRODUCT DATA:", response.data.data);

        setProducts(response.data.data);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

    const fetchSales = async () => {
        try {
            const response = await getSales();

            console.log("SALES API RESPONSE:", response);
            console.log("SALES DATA:", response.data.data);

            setSales(response.data.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if(!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5001/api/products/${id}`);

            setProducts((prevProducts) => 
                prevProducts.filter((product) => product._id !== id)
        );

        alert("Product deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete product");
        }
    };

    const handleRestock = async (id) => {
        if (!restockQuantity || Number(restockQuantity) <= 0) {
            alert("Please enter a valid restock quantity.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5001/api/products/${id}/restock`,
                {
                    quantity: Number(restockQuantity),
                }
            );

            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === id
                        ? response.data.data
                        : product
                )
            );

            setRestockProductId(null);
            setRestockQuantity("");

            alert("Product restocked successfully.");
        } catch (error) {
            console.error("Restock error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to restock product."
            );
        }
    };
    return(
        <div className= "min-h-screen bg-gray-100 flex">

            {/* Sidebar */}
            <aside className= "w-64 bg-slate-900 text-white p-6">
                <h1 className="text-2xl font-bold text-blue-400 mb-10">
                    StockFlow
                </h1>

                <nav className="space-y-4">
                    <button className="block w-full text-left px-3 py-2 rounded-lg bg-blue-600">
                        Dashboard
                    </button>

                    <Link 
                       to="/products"
                       className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800"
                    >
                        Products
                      </Link>

                    <Link
                       to="/suppliers"
                       className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800"
                    >
                        Suppliers
                    </Link>

                    <Link 
                        to="/supplier-performance"
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800"
                    >
                        Supplier Performance
                    </Link>

                    <Link
                       to="/billing"
                       className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800"
                    >
                        Billing
                    </Link>

                    <Link
                        to="/reports" 
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800"
                    >
                        Reports
                    </Link>

                    <Link
                        to="/stock-history"
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800"
                    >
                        Stock History
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">

                {/* Top Bar */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">
                        Product Management
                    </h2>

                    <Link
                       to="/products"
                       className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Add Product
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Total Products</p>
                        <h3 className="text-3xl font-bold mt-2">
                            {totalProducts}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Total Stock</p>
                        <h3 className="text-3xl font-bold mt-2">
                            {totalStock}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Low Stock Items</p>
                        <h3 className="text-3xl font-bold mt-2">
                            {lowStockProducts}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Inventory Value</p>
                        <h3 className="text-3xl font-bold mt-2">
                            ₹{inventoryValue}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Total Revenue</p>
                        <h3 className="text-3xl font-bold mt-2">
                            ₹{totalRevenue}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Products Sold</p>
                        <h3 className="text-3xl font-bold mt-2">
                            {productsSold}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Total Profit</p>
                        <h3 className="text-3xl font-bold mt-2">
                            ₹{totalProfit}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Today's Sales</p>
                        <h3 className="text-3xl font-bold mt-2">
                            {todaySales.length}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Today's Revenue</p>
                        <h3 className="text-3xl font-bold mt-2">
                            ₹{todayRevenue}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">Today's Profit</p>
                        <h3 className="text-3xl font-bold mt-2">
                            ₹{todayProfit}
                        </h3>
                    </div>

                </div>

                {/* Sales Revenue Trend */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Sales Revenue Trend
                    </h2>

                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueTrendData}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="date" />

                                <YAxis />

                                <Tooltip
                                    formatter={(value) => [`₹${value}`, "Revenue"]}
                                />

                                <Line 
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top-Selling Products */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Top-Selling Products
                    </h2>

                    {topSellingProducts.length === 0 ? (
                        <p className="text-gray-500">
                            No sales data available.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-3">
                                            Product
                                        </th>

                                        <th className="text-left p-3">
                                            Units Sold
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {topSellingProducts.map((product, index) => (
                                        <tr 
                                            key={product.name}
                                            className="border-t"
                                        >
                                            <td className="p-3 font-medium">
                                                {index + 1}. {product.name}
                                            </td>

                                            <td className="p-3 font-semibold">
                                                {product.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Low Stock Alerts
                        </h2>

                        <Link
                            to="/products"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Manage Products →
                        </Link>
                    </div>

                    {products.filter(
                        (product) => product.stock <= product.lowStockAlert
                    ).length === 0 ? (
                        <p className="text-gray-500">
                            All products have sufficient stock.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-3">
                                            Product
                                        </th>

                                        <th className="text-left p-3">
                                            Current Stock
                                        </th>

                                        <th className="text-left p-3">
                                            Alert Level
                                        </th>

                                        <th className="text-left p-3">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products
                                        .filter(
                                            (product) =>
                                                product.stock <= product.lowStockAlert
                                        )
                                        .map((product) => (
                                            <tr
                                                key={product._id}
                                                className="border-t"
                                            >
                                                <td className="p-3 font-medium">
                                                    {product.name}
                                                </td>

                                                <td className="p-3 text-red-600 font-semibold">
                                                    {product.stock}
                                                </td>

                                                <td className="p-3">
                                                    {product.lowStockAlert}
                                                </td>

                                                <td className="p-3">
                                                    {restockProductId === product._id ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                placeholder="Qty"
                                                                value={restockQuantity}
                                                                onChange={(e) =>
                                                                    setRestockQuantity(e.target.value)
                                                                }
                                                                className="w-20 border rounded px-2 py-1"
                                                            />

                                                            <button
                                                                onClick={() => handleRestock(product._id)}
                                                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                            >
                                                                Add
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setRestockProductId(null);
                                                                    setRestockQuantity("");
                                                                }}
                                                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                                                Low Stock
                                                            </span>

                                                            <button 
                                                                onClick={() => setRestockProductId(product._id)}
                                                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                            >
                                                                Restock
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                        <Link
                            to="/products"
                            className="bg-blue-600 text-white text-center px-4 py-3 rounded-lg hover:bg-blue-700"
                        >
                            + Add Product
                        </Link>

                        <Link
                            to="/billing"
                            className="bg-green-600 text-white text-center px-4 py-3 rounded-lg hover:bg-green-700"
                        >
                            Create Bill
                        </Link>

                        <Link
                            to="/suppliers"
                            className="bg-purple-600 text-white text-center px-4 py-3 rounded-lg hover:bg-purple-700"
                        >
                            Manage Suppliers
                        </Link>

                        <Link
                            to="/stock-history"
                            className="bg-orange-500 text-white text-center px-4 py-3 rounded-lg hover:bg-orange-600"
                        >
                            Stock History
                        </Link>

                        <Link
                            to="/reports"
                            className="bg-slate-700 text-white text-center px-4 py-3 rounded-lg hover:bg-slate-800"
                        >
                            View Reports
                        </Link>

                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                    <input
                       type="text"
                       placeholder="Search products..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                {/* Recent Sales*/}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Recent Sales
                        </h2>

                        <Link
                            to="/reports"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            View Reports →
                        </Link>
                    </div>

                    {sales.length === 0 ? (
                        <p className="text-gray-500">
                            No sales recorded yet.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-3">
                                            Customer
                                        </th>

                                        <th className="text-left p-3">
                                            Date
                                        </th>

                                        <th className="text-left p-3">
                                            Items
                                        </th>

                                        <th className="text-left p-3">
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sales
                                        .slice()
                                        .sort(
                                            (a, b) =>
                                                new Date(b.createdAt) - new Date(a.createdAt)
                                        )
                                        .slice(0, 5)
                                        .map((sale) => (
                                            <tr
                                                key={sale._id}
                                                className="border-t"
                                            >
                                                <td className="p-3 font-medium">
                                                    {sale.customerName || "Walk-in Customer"}
                                                </td>

                                                <td className="p-3">
                                                    {new Date(
                                                        sale.createdAt
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td className="p-3">
                                                    {sale.items.reduce(
                                                        (total, item) =>
                                                            total + item.quantity,
                                                        0
                                                    )}
                                                </td>

                                                <td className="p-3 font-semibold">
                                                    ₹{sale.total}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Product Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4">Product</th>
                                <th className="text-left p-4">Category</th>
                                <th className="text-left p-4">Price</th>
                                <th className="text-left p-4">Stock</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-6 text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 font-medium">{product.name}</td>

                                        <td className="p-4">{product.category}</td>

                                        <td className="p-4">{product.sellingPrice}</td>

                                        <td className="p-4">{product.stock}</td>

                                        <td className="p-4">
                                            <span 
                                               className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                 product.stock <= product.lowStockAlert
                                                 ? "bg-red-100 text-red-700"
                                                 : "bg-green-100 text-green-700"
                                               }`}
                                            >
                                                {product.stock <= product.lowStockAlert
                                                ? "Low Stock"
                                                : "In Stock"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Link
                                                   to="/products"
                                                   className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                   className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                   onClick={() => handleDelete(product._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}

export default Dashboard;