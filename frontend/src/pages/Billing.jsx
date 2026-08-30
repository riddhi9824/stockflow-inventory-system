import { useEffect, useState } from "react";
import axios from "axios";

function Billing() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [generatedBill, setGeneratedBill] = useState(null);

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

    // Filter products
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add product to cart
    const addToCart = (product) => {
        const existingProduct = cart.find(
            (item) => item._id === product._id
        );

        if (existingProduct) {
            setCart(
                cart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1,
                },
            ]);
        }
    };

    // Remove product from cart
    const removeFromCart = (id) => {
        setCart(cart.filter((item) => item._id !== id));
    };

    //Generate bill
    const handleGenerateBill = async() => {
        if (cart.length === 0){
            alert("Please add at least one product to the bill.");
            return;
        }

        try {
            const saleData = {
                items: cart.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                })),
            };

            const response = await axios.post(
                "http://localhost:5001/api/sales",
                saleData
            );

            setGeneratedBill(response.data.data);

            alert("Bill generated successfully!");

            setCart([]);

            fetchProducts();
        } catch (error) {
            console.error("Generate bill error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to generate bill"
            );
        }
    };

    // Calculate subtotal
    const subtotal = cart.reduce(
        (total, item) =>
            total + item.sellingPrice * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Billing
                </h1>

                <p className="text-gray-500 mt-1">
                    Create a new customer bill
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Products Section */}
                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Select Products
                    </h2>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border rounded-lg px-4 py-3 mb-5 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    {/* Product List */}
                    <div className="space-y-3">

                        {filteredProducts.length === 0 ? (
                            <p className="text-gray-500 text-center py-6">
                                No products found.
                            </p>
                        ) : (
                            filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="border rounded-lg p-4 flex justify-between items-center"
                                >

                                    <div>
                                        <h3 className="font-semibold">
                                            {product.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            SKU: {product.sku}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            ₹{product.sellingPrice} | Stock: {product.stock}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                    >
                                        Add
                                    </button>

                                </div>
                            ))
                        )}

                    </div>
                </div>

                {/* Cart Section */}
                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Current Bill
                    </h2>

                    {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">
                            No products added to bill.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    className="border-b pb-4"
                                >

                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-semibold">
                                                {item.name}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                ₹{item.sellingPrice} × {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-semibold">
                                            ₹{item.sellingPrice * item.quantity}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center mt-3">

                                        <div className="flex items-center gap-2">

                                            <button
                                                className="px-3 py-1 bg-gray-200 rounded"
                                                onClick={() => {
                                                    if (item.quantity > 1) {
                                                        setCart(
                                                            cart.map((cartItem) =>
                                                                cartItem._id === item._id
                                                                    ? {
                                                                        ...cartItem,
                                                                        quantity: cartItem.quantity - 1,
                                                                    }
                                                                    : cartItem
                                                            )
                                                        );
                                                    }
                                                }}
                                            >
                                                -
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                className="px-3 py-1 bg-gray-200 rounded"
                                                onClick={() => {
                                                    if (item.quantity < item.stock) {
                                                        setCart(
                                                            cart.map((cartItem) =>
                                                                cartItem._id === item._id
                                                                    ? {
                                                                        ...cartItem,
                                                                        quantity: cartItem.quantity + 1,
                                                                    }
                                                                    : cartItem
                                                            )
                                                        );
                                                    }
                                                }}
                                            >
                                                +
                                            </button>

                                        </div>

                                        <button
                                            onClick={() =>
                                                removeFromCart(item._id)
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>
                            ))}

                            {/* Total */}
                            <div className="border-t pt-4">

                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>₹{subtotal}</span>
                                </div>

                                <button
                                    onClick={handleGenerateBill}
                                    className="w-full mt-5 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                                >
                                    Generate Bill
                                </button>

                            </div>

                        </div>
                    )}

                </div>

            </div>

            {/* Generated Invoice */}
            {generatedBill && (
                <div className="mt-8 bg-white rounded-xl shadow p-8">

                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                StockFlow
                            </h2>

                            <p className="text-gray-500">
                                Sales Invoice
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold">
                                Bill ID: {generatedBill._id.slice(-6)}
                            </p>

                            <p className="text-gray-500">
                                Date:{" "}
                                {new Date(
                                    generatedBill.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3">
                                        Product
                                    </th>

                                    <th className="text-left p-3">
                                        Price
                                    </th>

                                    <th className="text-left p-3">
                                        Quantity
                                    </th>

                                    <th className="text-left p-3">
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {generatedBill.items.map((item) => (
                                    <tr
                                       key={item.product}
                                       className="border-t"
                                    >
                                        <td className="p-3">
                                            {item.name}
                                        </td>

                                        <td className="p-3">
                                            ₹{item.price}
                                        </td>

                                        <td className="p-3">
                                            {item.quantity}
                                        </td>

                                        <td className="p-3 font-medium">
                                            ₹{item.total}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                    {/* Invoice Total */}
                    <div className="flex justify-end mt-6">

                        <div className="w-64">
                            
                            <div className="flex justify-between text-xl font-bold border-t pt-4">
                                <span>Total</span>

                                <span>
                                    ₹{generatedBill.total}
                                </span>

                            </div>

                        </div>

                    </div>
                    
                </div>
            )}

        </div>
    );
}

export default Billing;