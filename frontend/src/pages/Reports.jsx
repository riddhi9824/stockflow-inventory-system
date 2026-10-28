import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

function Reports() {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);

    const [dateFilter, setDateFilter] = useState("all");
    const [startDate,setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const today = new Date().toLocaleDateString();

    const getDateRange = () => {
        const now = new Date();
        const todayDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        if (dateFilter === "today") {
            return { start: todayDate, end: todayDate };
        }

        if (dateFilter === "7days") {
            const start = new Date(todayDate);
            start.setDate(start.getDate() - 6);
            return { start, end: todayDate };
        }

        if (dateFilter === "30days") {
            const start = new Date(todayDate);
            start.setDate(start.getDate() - 29);
            return { start, end: todayDate };
        }

        if (dateFilter === "custom") {
            return {
                start: startDate
                    ? new Date(`${startDate}T00:00:00`)
                    : null,
                end: endDate
                    ? new Date(`${endDate}T23:59:59:999`)
                    : null,
            };
        }

        return { start: null, end: null };
    };

    const { start: rangeStart, end: rangeEnd } = getDateRange();

    const filteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.createdAt);

        if (rangeStart && saleDate < rangeStart) return false;
        if (rangeEnd && saleDate > rangeEnd) return false;

        return true;
    });

    const handleExportCSV = () => {
        if (filteredSales.length === 0) {
            alert("No sales available to export.");
            return;
        }

        const headers = [
            "Sale Date",
            "Customer",
            "Items Sold",
            "Revenue",
            "Cost",
            "Profit",
        ];

        const rows = filteredSales.map((sale) => {
            const cost = sale.items.reduce(
                (total, item) =>
                    total + item.costPrice * item.quantity,
                0
            );

            const itemsSold = sale.items
                .map((item) => `${item.name} (Qty: ${item.quantity})`)
                .join("; ");

            return [
                new Date(sale.createdAt).toLocaleDateString(),
                sale.customerName || "Walk-in Customer",
                itemsSold,
                sale.total,
                cost,
                sale.total - cost,
            ];
        });

        const csvContent = [headers, ...rows]
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value ?? "").replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\r\n");

            const blob = new Blob(
                ["\uFEFF" + csvContent],
                { type: "text/csv;charset=utf-8;" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `StockFlow-Sales-Report-${new Date()
                .toISOString()
                .slice(0, 10)}.csv`;
            
            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
    };

    const handleExportPDF = () => {
        if (filteredSales.length === 0) {
            alert("No sales available to export.");
            return;
        }

        const doc = new jsPDF();

        const totalRevenue = filteredSales.reduce(
            (total, sale) => total + sale.total,
            0
        );

        const totalCost = filteredSales.reduce(
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

        doc.setFontSize(20);
        doc.text("StockFlow Sales Report", 14, 20);

        doc.setFontSize(10);
        doc.text(
            `Generated: ${new Date().toLocaleDateString()}`,
            14,
            29
        );

        const filterLabels = {
            all: "All Time",
            today: "Today",
            "7days": "Last 7 Days",
            "30days": "Last 30 Days",
            custom: "Custom Range",
        };

        const selectedPeriod = 
            dateFilter === "custom" && startDate && endDate
                ? `${startDate} to ${endDate}`
                : filterLabels[dateFilter] || "All Time";

        doc.text(
            `Selected Period: ${selectedPeriod}`,
            14,
            36
        );

        doc.setFontSize(12);
        doc.text(
            `Total Bills: ${filteredSales.length}`,
            14, 
            48
        );
        doc.text(
            `Revenue: ${totalRevenue.toFixed(2)}`,
            14,
            56
        );
        doc.text(
            `Cost: ${totalCost.toFixed(2)}`,
            14,
            64
        );
        doc.text(
            `Profit: ${totalProfit.toFixed(2)}`,
            14,
            72
        );

        const rows = filteredSales.map((sale) => {
            const cost = sale.items.reduce(
                (total, item) =>
                    total + item.costPrice * item.quantity,
                0
            );

            const items = sale.items
                .map(
                    (item) =>
                        `${item.name} (Qty: ${item.quantity})`
                )
                .join(", ");
            
            return [
                new Date(sale.createdAt).toLocaleDateString(),
                sale.customerName || "Walk-in Customer",
                items,
                `Rs. ${Number(sale.total).toFixed(2)}`,
                `Rs. ${cost.toFixed(2)}`,
                `Rs. ${(sale.total - cost).toFixed(2)}`,
            ];
        });

        autoTable(doc, {
            startY: 82,
            head: [[
                "Date",
                "Customer",
                "Items",
                "Revenue",
                "Cost",
                "Profit",
            ]],
            body: rows,
            styles: {
                fontSize: 8,
                cellPadding: 3,
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: [37, 99, 235],
            },
            columnStyles: {
                2: { cellWidth: 45 },
            },
        });

        doc.save(
            `StockFlow-Sale-Report-${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`
        );
    };

    const todaySales = sales.filter(
        (sale) => 
            new Date(sale.createdAt).toLocaleDateString() === today
    );

    const todayRevenue = todaySales.reduce(
        (total, sale) => total + sale.total,
        0
    );

    const totalRevenue = filteredSales.reduce(
        (total, sale) => total + sale.total,
        0
    );

    const totalCost = filteredSales.reduce(
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

    const salesTrendData = filteredSales.reduce((data, sale) => {
        const date = new Date(sale.createdAt).toLocaleDateString();

        const existingDate = data.find((item) => item.date === date);

        if(existingDate) {
            existingDate.revenue += sale.total;
        } else {
            data.push({
                date,
                revenue: sale.total,
            });
        }

        return data;
    }, []).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const productSalesData = filteredSales.reduce((data, sale) => {
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
    }, []);

    const productProfitData = filteredSales.reduce((data, sale) => {
        sale.items.forEach((item) => {
            const existingProduct = data.find(
                (product) => product.name === item.name
            );

            const profit = (item.price - item.costPrice) * item.quantity;

            if(existingProduct) {
                existingProduct.profit += profit;
            } else {
                data.push({
                    name: item.name,
                    profit,
                });
            }
        });

        return data;
    }, []);

    const lowStockProducts = products.filter(
        (product) => product.stock <= product.lowStockAlert
    );

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
        fetchSales();
        fetchProducts();
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

                <p className="text-sm text-gray-500 mt-2">
                    Report generated: {new Date().toLocaleString()}
                </p>
            </div>

            {/* Date Range Filter */}
            <div className="bg-white rounded-xl shadow p-5 mb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter Sales By
                        </label>

                        <select 
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus: outline-none focus:ring-2 focus: ring-blue-500"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    {dateFilter === "custom" && (
                        <>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>

                                <input 
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    max={endDate || undefined}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || undefined}
                                    max={new Date().toLocaleDateString("en-CA")}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            
            {/* Export Buttons */}
            <div className="flex justify-end gap-3 mb-6">
                <button
                    onClick={handleExportCSV}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition-colors"
                >
                    Export CSV
                </button>

                <button     
                    onClick={handleExportPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition-colors"
                >
                    Export PDF
                </button>

                <button
                    onClick={() => window.print()}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-lg shadow transition-colors"
                >
                    Print Report
                </button>
            </div>


            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-gray-500">
                        Total Bills
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {filteredSales.length}
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
                        {filteredSales.reduce(
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

            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">
                    Revenue Trend
                </h2>

                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [`Rs. ${value}`, "Revenue"]}
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

            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">
                    Sales by Product
                </h2>

                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productSalesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [value, "Units Sold"]}
                            />
                            <Bar
                                dataKey="quantity"
                                fill="#16a34a"
                                name="Units Sold"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">
                    Profit by Product
                </h2>

                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productProfitData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [`Rs. ${value}`, "Profit"]}
                            />
                            <Bar 
                                dataKey="profit"
                                fill="#16a34a"
                                name="Profit"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">
                    Low Stock Products
                </h2>

                {lowStockProducts.length === 0 ? (
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
                                        Stock
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
                                {lowStockProducts.map((product) => (
                                    <tr 
                                        key={product._id}
                                        className="border-t"
                                    >
                                        <td className="p-3 font-medium">
                                            {product.name}
                                        </td>

                                        <td className="p-3">
                                            {product.stock}
                                        </td>

                                        <td className="p-3">
                                            {product.lowStockAlert}
                                        </td>

                                        <td className="p-3">
                                            <span className="text-red-600 font-semibold">
                                                Low Stock
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-5 border-b">
                    <h2 className="text-xl font-semibold">
                        Recent Sales
                    </h2>
                </div>

                {filteredSales.length === 0 ? (
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

                                {filteredSales.map((sale) => (
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