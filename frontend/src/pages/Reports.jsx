import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
    const [sales, setSales] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);

    const today = new Date().toLocaleDateString();

    const todaySales = sales.filter(
        (sale) => 
            new Date(sale.createdAt).toLocaleDateString() === today
    );

    const todayRevenue = todaySales.reduce(
        (total, sale) => total + sale.total,
        0
    );

    const totalRevenue = sales.reduce(
        (total, sale) => total + sale.total,
        0
    );

    const totalCost = sales.reduce(
        (total, sale) => 
            total + 
            sale.items.reduce(
                (itemTotal, item) =>
                    itemTotal + item.costPrice * item.quantity,
                    0
            ),
            0
    );

    const totalProfit = totalRevenue - totalCost;

    const fetchSales = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5001/api/sales"
            );

            setSales(response.data.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Sales History
                </h1>

                <p className="text-gray-500 mt-1">
                    View all completed sales and bills
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">
                        Total Bills
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {sales.length}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">
                        Total Revenue
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        ₹{totalRevenue}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">
                        Today's Revenue
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        ₹{todayRevenue}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">
                        Products Sold
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {sales.reduce(
                            (total, sale) =>
                                total +
                                sale.items.reduce(
                                    (itemTotal, item) =>
                                        itemTotal + item.quantity,
                                    0
                                ),
                            0
                        )}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">
                        Total Profit
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        ₹{totalProfit}
                    </h2>
                </div>

            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-5 border-b">
                    <h2 className="text-xl font-semibold">
                        Recent Sales
                    </h2>
                </div>

                {sales.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No sales found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-4">
                                        Bill ID
                                    </th>

                                    <th className="text-left p-4">
                                        Date
                                    </th>

                                    <th className="text-left p-4">
                                        Products
                                    </th>

                                    <th className="text-left p-4">
                                        Items
                                    </th>

                                    <th className="text-left p-4">
                                        Total
                                    </th>

                                    <th className="text-left p-4">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {sales.map((sale) => (
                                    <tr
                                        key={sale._id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-4 font-medium">
                                            {sale._id.slice(-6)}
                                        </td>

                                        <td className="p-4">
                                            {new Date(
                                                sale.createdAt
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="p-4">
                                            {sale.items
                                                .map((item) => item.name)
                                                .join(", ")}
                                        </td>

                                        <td className="p-4">
                                            {sale.items.reduce(
                                                (total, item) =>
                                                    total + item.quantity,
                                                0
                                            )}
                                        </td>

                                        <td className="p-4 font-semibold">
                                            ₹{sale.total}
                                        </td>

                                        <td className="p-4">
                                            <button 
                                                 onClick={() => setSelectedSale(sale)}
                                                 className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                                            >
                                                View Invoice
                                            </button>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {selectedSale && (
                <div className="invoice-overlay fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="invoice-print bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">

                        {/* Invoice Header */}
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
                                    Bill ID: {selectedSale._id.slice(-6)}
                                </p>

                                <p className="text-gray-500">
                                    Date:{" "}
                                    {new Date(
                                        selectedSale.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                        </div>

                        {/* Invoice Items */}
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

                                {selectedSale.items.map((item) => (
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

                        {/* Total */}
                        <div className="flex justify-end mt-6">

                            <div className="w-64 border-t pt-4">

                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>

                                    <span>
                                        ₹{selectedSale.total}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-8">

                            <button 
                                onClick={() => setSelectedSale(null)}
                                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Close
                            </button>

                            <button
                                onClick={() => window.print()}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                            >
                                🖨️ Print
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Reports;