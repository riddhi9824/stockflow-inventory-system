import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { getSales } from "../services/saleService";

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sales, setSales] = useState([]);

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