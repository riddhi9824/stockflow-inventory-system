import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        barcode: "",
        category: "",
        costPrice: "",
        sellingPrice: "",
        stock: "",
        lowStockAlert: 5,
    });

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5001/api/products"
            );

            setProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    
    const filteredProducts = products.filter((product) => 
       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
       product.category.toLowerCase().includes(searchTerm.toLowerCase())
);

    // Handle form input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Add / Update Product
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = {
                ...formData,
                costPrice: Number(formData.costPrice),
                sellingPrice: Number(formData.sellingPrice),
                stock: Number(formData.stock),
                lowStockAlert: Number(formData.lowStockAlert),
            };

            if (editingId) {
                // Update product
                await axios.put(
                    `http://localhost:5001/api/products/${editingId}`,
                    productData
                );

                alert("Product updated successfully!");
            } else {
                // Add product
                await axios.post(
                    "http://localhost:5001/api/products",
                    productData
                );

                alert("Product added successfully!");
            }

            resetForm();
            fetchProducts();

        } catch (error) {
            console.error("Error saving product:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save product"
            );
        }
    };

    // Edit product
    const handleEdit = (product) => {
        setEditingId(product._id);

        setFormData({
            name: product.name,
            sku: product.sku,
            barcode: product.barcode || "",
            category: product.category,
            costPrice: product.costPrice,
            sellingPrice: product.sellingPrice,
            stock: product.stock,
            lowStockAlert: product.lowStockAlert,
        });

        setShowForm(true);
    };

    // Delete product
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `http://localhost:5001/api/products/${id}`
            );

            alert("Product deleted successfully!");

            fetchProducts();

        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            sku: "",
            barcode: "",
            category: "",
            costPrice: "",
            sellingPrice: "",
            stock: "",
            lowStockAlert: 5,
        });

        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Product Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your inventory products
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                >
                    {showForm ? "Close Form" : "+ Add Product"}
                </button>
            </div>

            {/* Add / Edit Product Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow mb-8">

                    <h2 className="text-xl font-semibold mb-5">
                        {editingId ? "Edit Product" : "Add New Product"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >

                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            name="sku"
                            placeholder="SKU"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            name="barcode"
                            placeholder="Barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="number"
                            name="costPrice"
                            placeholder="Cost Price"
                            value={formData.costPrice}
                            onChange={handleChange}
                            min="0"
                            required
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="number"
                            name="sellingPrice"
                            placeholder="Selling Price"
                            value={formData.sellingPrice}
                            onChange={handleChange}
                            min="0"
                            required
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock Quantity"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            required
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="number"
                            name="lowStockAlert"
                            placeholder="Low Stock Alert"
                            value={formData.lowStockAlert}
                            onChange={handleChange}
                            min="0"
                            className="border p-3 rounded-lg"
                        />

                        <button
                            type="submit"
                            className="md:col-span-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                        >
                            {editingId ? "Update Product" : "Add Product"}
                        </button>

                    </form>
                </div>
            )}

            <div className="bg-white p-4 rounded-xl shadow mb-6">
                <input 
                    type="text"
                    placeholder="Search by name, SKU or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                />
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-5 border-b">
                    <h2 className="text-xl font-semibold">
                        Products
                    </h2>
                </div>

                {products.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No products found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-4">Product</th>
                                    <th className="text-left p-4">SKU</th>
                                    <th className="text-left p-4">Category</th>
                                    <th className="text-left p-4">Cost Price</th>
                                    <th className="text-left p-4">Selling Price</th>
                                    <th className="text-left p-4">Stock</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredProducts.map((product) => {

                                    const isLowStock =
                                        product.stock <= product.lowStockAlert;

                                    return (
                                        <tr
                                            key={product._id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="p-4 font-medium">
                                                {product.name}
                                            </td>

                                            <td className="p-4">
                                                {product.sku}
                                            </td>

                                            <td className="p-4">
                                                {product.category}
                                            </td>

                                            <td className="p-4">
                                                ₹{product.costPrice}
                                            </td>

                                            <td className="p-4">
                                                ₹{product.sellingPrice}
                                            </td>

                                            <td className="p-4">
                                                {product.stock}
                                            </td>

                                            <td className="p-4">
                                                <span
                                                    className={
                                                        isLowStock
                                                            ? "text-red-600 font-medium"
                                                            : "text-green-600 font-medium"
                                                    }
                                                >
                                                    {isLowStock
                                                        ? "Low Stock"
                                                        : "In Stock"}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(product)
                                                        }
                                                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(product._id)
                                                        }
                                                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Products;