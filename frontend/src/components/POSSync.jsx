import { useState } from "react";
import api from "../services/api";

export default function POSSync() {

    const [form, setForm] = useState({
        product_name: "",
        category: "",
        quantity: "",
        purchase_date: "",
        expiry_date: "",
        storage_type: "",
        barcode: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSync = async () => {

    if (
        !form.product_name ||
        !form.category ||
        !form.quantity ||
        !form.purchase_date ||
        !form.expiry_date ||
        !form.storage_type ||
        !form.barcode
    ) {
        alert("Please fill all fields.");
        return;
    }

    try {

        const payload = {
            product_name: form.product_name,
            category: form.category,
            quantity: Number(form.quantity),
            purchase_date: form.purchase_date,
            expiry_date: form.expiry_date,
            storage_type: form.storage_type,
            barcode: form.barcode
        };

        console.log("Payload:", payload);

        const res = await api.post("/inventory/pos-sync", payload);

        alert(res.data.message);

        setForm({
            product_name: "",
            category: "",
            quantity: "",
            purchase_date: "",
            expiry_date: "",
            storage_type: "",
            barcode: ""
        });

        // Refresh page to fetch latest inventory
        window.location.reload();

    } catch (err) {

        console.log(err.response?.data);

        alert(err.response?.data?.detail || "POS Sync Failed");

    }

};

    return (

        <div className="card shadow mt-3">

            <div className="card-header bg-success text-white">
                🛒 POS Integration
            </div>

            <div className="card-body">

                <input
                    type="text"
                    className="form-control mb-2"
                    name="product_name"
                    placeholder="Product Name"
                    value={form.product_name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    className="form-control mb-2"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    className="form-control mb-2"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={handleChange}
                />

                <input
                    type="date"
                    className="form-control mb-2"
                    name="purchase_date"
                    value={form.purchase_date}
                    onChange={handleChange}
                />

                <input
                    type="date"
                    className="form-control mb-2"
                    name="expiry_date"
                    value={form.expiry_date}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    className="form-control mb-2"
                    name="storage_type"
                    placeholder="Storage Type"
                    value={form.storage_type}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    className="form-control mb-3"
                    name="barcode"
                    placeholder="Barcode"
                    value={form.barcode}
                    onChange={handleChange}
                />

                <button
                    type="button"
                    className="btn btn-success w-100"
                    onClick={handleSync}
                >
                    Sync POS
                </button>

            </div>

        </div>

    );

}