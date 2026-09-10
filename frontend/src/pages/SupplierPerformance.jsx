import { useEffect, useState } from "react";
import axios from "axios";

function SupplierPerformance(){
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPerformance = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5001/api/suppliers/performance"
            );

            setPerformance(response.data.data);
        } catch (error) {
            console.error("Error fetching supplier performance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, []);

    if (loading) {
        return <div className="p-6">Loading supplier performance...</div>
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Supplier Performance
            </h1>

            {performance.length === 0 ? (
                <p>No supplier performance data found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {performance.map((item) => (
                        <div
                            key={item.supplier._id}
                            className="bg-white rounded-xl shadow p-6"
                        >
                            <h2 className="text-xl font-semibold mb-3">
                                {item.supplier.name}
                            </h2>

                            <div className="space-y-2 text-gray-600">
                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {item.supplier.phone}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {item.supplier.email || "N/A"}
                                </p>

                                <p>
                                    <strong>Address:</strong>{" "}
                                    {item.supplier.address || "N/A"}
                                </p>
                            </div>

                            <hr className="my-4" />

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-2xl font-bold">
                                        {item.productCount}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Produts
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl font-bold">
                                        {item.restockCount}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Restocks
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl font-bold">
                                        {item.totalQuantityRestocked}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Units Restocked
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SupplierPerformance;