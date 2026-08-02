import { useState } from "react";
import api from "../services/api";
import BarcodeScanner from "./BarcodeScanner";

function InventoryForm() {

    const [form, setForm] = useState({
        product_name: "",
        category: "",
        quantity: "",
        purchase_date: "",
        expiry_date: "",
        storage_type: "",
        barcode: "",
        business_id: 1
    });

    const [loadingCategory, setLoadingCategory] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Handle form fields
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Auto Categorization
    const handleProductChange = async (e) => {

        const value = e.target.value;

        setForm((prev) => ({
            ...prev,
            product_name: value
        }));

        if (value.trim().length < 3) return;

        try {

            setLoadingCategory(true);

            const res = await api.get(`/inventory/categorize/${value}`);

            setForm((prev) => ({
                ...prev,
                product_name: value,
                category: res.data.category || "",
                storage_type: res.data.storage || ""
            }));

        } catch (error) {

            console.log(error);

        } finally {

            setLoadingCategory(false);

        }
    };

    // Submit
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await api.put(`/inventory/${editingId}`, form);

                alert("Inventory Updated Successfully");

            } else {

                await api.post("/inventory/add", form);

                alert("Inventory Added Successfully");

            }

            // Reset Form
            setForm({
                product_name: "",
                category: "",
                quantity: "",
                purchase_date: "",
                expiry_date: "",
                storage_type: "",
                barcode: "",
                business_id: 1
            });

            setEditingId(null);

        } catch (error) {

            console.log(error);

            alert("Operation Failed");

        }

    };

    return (

        <div>

            <h2>
                {editingId ? "Update Inventory" : "Add Inventory"}
            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="product_name"
                    placeholder="Product Name"
                    value={form.product_name}
                    onChange={handleProductChange}
                />

                {loadingCategory &&
                    <p style={{ color: "blue" }}>
                        Detecting category...
                    </p>
                }

                <br /><br />

                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="quantity"
                    type="number"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="purchase_date"
                    type="date"
                    value={form.purchase_date}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="expiry_date"
                    type="date"
                    value={form.expiry_date}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="storage_type"
                    placeholder="Storage Type"
                    value={form.storage_type}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    name="barcode"
                    placeholder="Barcode"
                    value={form.barcode}
                    onChange={handleChange}
                />

                <br />

                <button
                    type="button"
                    className="btn btn-secondary mt-2"
                    onClick={() => setShowScanner(true)}
                >
                    📷 Scan Barcode / QR
                </button>

                <br /><br />

                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    {editingId ? "Update Inventory" : "Add Inventory"}
                </button>

            </form>

            {showScanner && (

                <BarcodeScanner

                    onScan={async (code) => {

                        // Inventory QR
                        if (code.startsWith("INV-")) {

                            const id = code.replace("INV-", "");

                            try {

                                const res = await api.get(`/inventory/${id}`);

                                setForm({
                                    business_id: res.data.business_id,
                                    product_name: res.data.product_name,
                                    category: res.data.category,
                                    quantity: res.data.quantity,
                                    purchase_date: res.data.purchase_date,
                                    expiry_date: res.data.expiry_date,
                                    storage_type: res.data.storage_type,
                                    barcode: res.data.barcode
                                });

                                setEditingId(res.data.id);

                                alert("Inventory Loaded Successfully");

                            } catch (err) {

                                console.log(err);

                                alert("Inventory Not Found");

                            }

                        }

                        // Normal Product Barcode
                        else {

                            setForm(prev => ({
                                ...prev,
                                barcode: code
                            }));

                        }

                        setShowScanner(false);

                    }}

                />

            )}

        </div>

    );

}

export default InventoryForm;