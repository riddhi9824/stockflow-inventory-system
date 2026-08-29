import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
    const [sales, setSales] = useState([]);

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

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
                        Total Sales
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        ₹
                        {sales.reduce(
                            (total, sale) => total + sale.total,
                            0
                        )}
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

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Reports;