import { useEffect, useState } from "react";
import axios from "axios";

function StockHistory() {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMovements = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5001/api/stock-movements"
            );

            setMovements(response.data.data);
        } catch (error) {
            console.error("Error fetching stock movements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovements();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Stock Movement History
            </h1>

            <p className="text-gray-500 mb-6">
                Track all restocks and sales affecting inventory.
            </p>

            {loading ? (
                <p className="text-gray-500">Loading stock movements...</p>
            ) : movements.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-6 text-gray-500">
                    No stock movements found.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4">
                                    Product
                                </th>
                                <th className="text-left px-6 py-4">
                                    Type
                                </th>
                                <th className="text-left px-6 py-4">
                                    Quantity
                                </th>
                                <th className="text-left px-6 py-4">
                                    Previous Stock
                                </th>
                                <th className="text-left px-6 py-4">
                                    New Stock
                                </th>
                                <th className="text-left px-6 py-4">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {movements.map((movement) => (
                                <tr 
                                   key={movement._id}
                                   className="border-t"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {movement.productName}
                                    </td>

                                    <td className="px-6 py-4">
                                        {movement.type === "RESTOCK" ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                                RESTOCK
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                                SALE
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 font-semibold">
                                        {movement.type === "RESTOCK"
                                            ? `+${movement.quantity}`
                                            : `-${movement.quantity}`}
                                    </td>

                                    <td className="px-6 py-4">
                                        {movement.previousStock}
                                    </td>

                                    <td className="px-6 py-4">
                                        {movement.newStock}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(
                                            movement.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default StockHistory;