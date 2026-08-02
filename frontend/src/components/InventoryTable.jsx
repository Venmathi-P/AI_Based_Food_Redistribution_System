import { useEffect, useState } from "react";
import api from "../services/api";
import { donateFood } from "../services/donationService";
import QRCode from "react-qr-code";
function InventoryTable() {
    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchInventory();
    }, []);

    // Fetch Inventory
    const fetchInventory = async () => {
        try {
            const res = await api.get("/inventory");
            setInventory(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Search Filter
    const filteredInventory = inventory.filter((item) =>
        item.product_name.toLowerCase().includes(search.toLowerCase())
    );

    // ---------- Risk Logic ----------
    const getRisk = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);

        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);

        const diff = Math.ceil(
            (expiry - today) / (1000 * 60 * 60 * 24)
        );

        if (diff <= 3) return "High";
        if (diff <= 10) return "Medium";
        return "Low";
    };

    // ---------- Recommendation ----------
    const getRecommendation = (expiryDate) => {
        const risk = getRisk(expiryDate);

        if (risk === "High") return "Donate Immediately";
        if (risk === "Medium") return "Donate Within 2 Days";
        return "Keep in Inventory";
    };

    // ---------- Risk Badge ----------
    const getRiskBadge = (expiryDate) => {
        const risk = getRisk(expiryDate);

        if (risk === "High")
            return <span className="badge bg-danger">🔴 High</span>;

        if (risk === "Medium")
            return <span className="badge bg-warning text-dark">🟠 Medium</span>;

        return <span className="badge bg-success">🟢 Low</span>;
    };

    // ---------- Storage Badge ----------
    const getStorageBadge = (storage) => {
        const value = (storage || "").toLowerCase();

        if (value.includes("cold"))
            return <span className="badge bg-info">COLD</span>;

        if (value.includes("freezer"))
            return <span className="badge bg-primary">FREEZER</span>;

        return <span className="badge bg-secondary">DRY</span>;
    };

    // Delete Inventory
    const deleteInventory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            await api.delete(`/inventory/${id}`);
            alert("Inventory deleted successfully");
            fetchInventory();
        } catch (err) {
            console.log(err);
            alert("Delete failed");
        }
    };

    // Update Inventory
    const updateInventory = async (item) => {
        const product_name = prompt("Product Name", item.product_name);
        if (product_name === null) return;

        const category = prompt("Category", item.category);
        if (category === null) return;

        const quantity = prompt("Quantity", item.quantity);
        if (quantity === null) return;

        const purchase_date = prompt(
            "Purchase Date (YYYY-MM-DD)",
            item.purchase_date
        );
        if (purchase_date === null) return;

        const expiry_date = prompt(
            "Expiry Date (YYYY-MM-DD)",
            item.expiry_date
        );
        if (expiry_date === null) return;

        const storage_type = prompt(
            "Storage Type",
            item.storage_type
        );
        if (storage_type === null) return;

        const barcode = prompt(
            "Barcode",
            item.barcode
        );
        if (barcode === null) return;

        try {
            await api.put(`/inventory/${item.id}`, {
                business_id: item.business_id,
                product_name,
                category,
                quantity: Number(quantity),
                purchase_date,
                expiry_date,
                storage_type,
                barcode,
            });

            alert("Inventory Updated Successfully");
            fetchInventory();
        } catch (err) {
            console.log(err.response?.data);
            alert("Update Failed");
        }
    };

    // Donate
    const handleDonate = async (inventoryId) => {
        try {
            const response = await donateFood(inventoryId);
            alert(response.message);
            fetchInventory();
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.detail ||
                "Unable to donate food."
            );
        }
    };

    return (
        <div>

            <h2 className="mb-3">Inventory Management</h2>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Search Product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <table className="table table-striped table-hover align-middle shadow">

                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Expiry</th>
                        <th>Storage</th>
                        <th>Risk</th>
                        <th>AI Recommendation</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {filteredInventory.length === 0 ? (

                        <tr>
                            <td colSpan="9" className="text-center">
                                No Inventory Found
                            </td>
                        </tr>

                    ) : (

                        filteredInventory.map((item, index) => (

                            <tr key={item.id}>

                                <td>{index + 1}</td>

                                <td>
                                    <strong>{item.product_name}</strong>
                                </td>

                                <td>{item.category}</td>

                                <td>{item.quantity}</td>

                                <td>{item.expiry_date}</td>

                                <td>
                                    {getStorageBadge(item.storage_type)}
                                </td>

                                <td>
                                    {getRiskBadge(item.expiry_date)}
                                </td>

                                <td>
                                    {getRecommendation(item.expiry_date)}
                                </td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => updateInventory(item)}
                                    >
                                        ✏ Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm me-2"
                                        onClick={() => deleteInventory(item.id)}
                                    >
                                        🗑 Delete
                                    </button>

                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleDonate(item.id)}
                                        disabled={item.is_donated}
                                    >
                                        {item.is_donated ? "Donated" : "❤ Donate"}
                                    </button>

                                </td>
                                <th>QR Code</th>
                                <td>
    <QRCode
        value={`INV-${item.id}`}
        size={60}
    />
</td>

                            </tr>
                            

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default InventoryTable;