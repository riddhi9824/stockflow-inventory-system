import { useEffect, useState } from "react";
import axios from "axios";

function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    });

    // Fetch suppliers
    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5001/api/suppliers"
            );

            setSuppliers(response.data.data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Filter suppliers
    const filteredSuppliers = suppliers.filter(
        (supplier) =>
            supplier.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            supplier.phone
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (supplier.email || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    // Handle form input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Add / Update Supplier
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:5001/api/suppliers/${editingId}`,
                    formData
                );

                alert("Supplier updated successfully!");
            } else {
                await axios.post(
                    "http://localhost:5001/api/suppliers",
                    formData
                );

                alert("Supplier added successfully!");
            }

            resetForm();
            fetchSuppliers();
        } catch (error) {
            console.error("Error saving supplier:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save supplier"
            );
        }
    };

    // Edit supplier
    const handleEdit = (supplier) => {
        setEditingId(supplier._id);

        setFormData({
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email || "",
            address: supplier.address || "",
        });

        setShowForm(true);
    };

    // Delete supplier
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this supplier?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `http://localhost:5001/api/suppliers/${id}`
            );

            alert("Supplier deleted successfully!");

            fetchSuppliers();
        } catch (error) {
            console.error("Error deleting supplier:", error);

            alert("Failed to delete supplier");
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            address: "",
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
                        Supplier Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your suppliers
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                >
                    {showForm ? "Close Form" : "+ Add Supplier"}
                </button>
            </div>

            {/* Add / Edit Supplier Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow mb-8">

                    <h2 className="text-xl font-semibold mb-5">
                        {editingId
                            ? "Edit Supplier"
                            : "Add New Supplier"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Supplier Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="border p-3 rounded-lg"
                        />

                        <button
                            type="submit"
                            className="md:col-span-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                        >
                            {editingId
                                ? "Update Supplier"
                                : "Add Supplier"}
                        </button>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow mb-6">
                <input
                    type="text"
                    placeholder="Search by name, phone or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                />
            </div>

            {/* Supplier Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-5 border-b">
                    <h2 className="text-xl font-semibold">
                        Suppliers
                    </h2>
                </div>

                {suppliers.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No suppliers found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-4">
                                        Supplier
                                    </th>

                                    <th className="text-left p-4">
                                        Phone
                                    </th>

                                    <th className="text-left p-4">
                                        Email
                                    </th>

                                    <th className="text-left p-4">
                                        Address
                                    </th>

                                    <th className="text-left p-4">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSuppliers.map((supplier) => (
                                    <tr
                                        key={supplier._id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 font-medium">
                                            {supplier.name}
                                        </td>

                                        <td className="p-4">
                                            {supplier.phone}
                                        </td>

                                        <td className="p-4">
                                            {supplier.email || "-"}
                                        </td>

                                        <td className="p-4">
                                            {supplier.address || "-"}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEdit(supplier)
                                                    }
                                                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            supplier._id
                                                        )
                                                    }
                                                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>

                                            </div>
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

export default Suppliers;