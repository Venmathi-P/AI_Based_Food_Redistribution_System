import { useEffect, useState } from "react";

import api from "../services/api";

import { donateFood } from "../services/donationService";

import {
    analyzeInventoryWithAI
} from "../services/aiService";

import QRCode from "react-qr-code";

import AIAnalysis from "./AIAnalysis";


function InventoryTable() {

    const [inventory, setInventory] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedAIInventory, setSelectedAIInventory] =
        useState(null);

    const [aiResults, setAIResults] = useState({});

    const [analyzingId, setAnalyzingId] =
        useState(null);


    // =====================================================
    // FETCH INVENTORY
    // =====================================================

    useEffect(() => {

        fetchInventory();

    }, []);


    const fetchInventory = async () => {

        try {

            const res = await api.get(
                "/inventory"
            );

            setInventory(
                res.data
            );

        } catch (err) {

            console.error(
                "Inventory fetch error:",
                err
            );

        }

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredInventory =
        inventory.filter((item) =>
            (item.product_name || "")
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );


    // =====================================================
    // EXPIRY RISK
    // =====================================================

    const getRisk = (expiryDate) => {

        if (!expiryDate)
            return "Low";

        const today = new Date();

        const expiry = new Date(
            expiryDate
        );

        today.setHours(
            0, 0, 0, 0
        );

        expiry.setHours(
            0, 0, 0, 0
        );

        const diff = Math.ceil(
            (
                expiry - today
            ) /
            (1000 * 60 * 60 * 24)
        );


        if (diff <= 3)
            return "High";

        if (diff <= 10)
            return "Medium";

        return "Low";
    };


    // =====================================================
    // RECOMMENDATION
    // =====================================================

    const getRecommendation = (
        expiryDate
    ) => {

        const risk =
            getRisk(expiryDate);


        if (risk === "High")
            return "Donate Immediately";


        if (risk === "Medium")
            return "Donate Within 2 Days";


        return "Keep in Inventory";
    };


    // =====================================================
    // RISK BADGE
    // =====================================================

    const getRiskBadge = (
        expiryDate
    ) => {

        const risk =
            getRisk(expiryDate);


        if (risk === "High") {

            return (
                <span className="badge bg-danger">
                    🔴 High
                </span>
            );

        }


        if (risk === "Medium") {

            return (
                <span className="badge bg-warning text-dark">
                    🟠 Medium
                </span>
            );

        }


        return (
            <span className="badge bg-success">
                🟢 Low
            </span>
        );

    };


    // =====================================================
    // STORAGE BADGE
    // =====================================================

    const getStorageBadge = (
        storage
    ) => {

        const value =
            (storage || "")
                .toLowerCase();


        if (
            value.includes("cold")
        ) {

            return (
                <span className="badge bg-info">
                    COLD
                </span>
            );

        }


        if (
            value.includes("freezer")
        ) {

            return (
                <span className="badge bg-primary">
                    FREEZER
                </span>
            );

        }


        return (
            <span className="badge bg-secondary">
                DRY
            </span>
        );

    };


    // =====================================================
    // DELETE
    // =====================================================

    const deleteInventory = async (
        id
    ) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this item?"
            )
        ) {
            return;
        }


        try {

            await api.delete(
                `/inventory/${id}`
            );

            alert(
                "Inventory deleted successfully"
            );

            fetchInventory();

        } catch (err) {

            console.error(err);

            alert(
                "Delete failed"
            );

        }

    };


    // =====================================================
    // UPDATE
    // =====================================================

    const updateInventory = async (
        item
    ) => {

        const product_name =
            prompt(
                "Product Name",
                item.product_name
            );

        if (
            product_name === null
        )
            return;


        const category =
            prompt(
                "Category",
                item.category
            );

        if (
            category === null
        )
            return;


        const quantity =
            prompt(
                "Quantity",
                item.quantity
            );

        if (
            quantity === null
        )
            return;


        const purchase_date =
            prompt(
                "Purchase Date (YYYY-MM-DD)",
                item.purchase_date
            );

        if (
            purchase_date === null
        )
            return;


        const expiry_date =
            prompt(
                "Expiry Date (YYYY-MM-DD)",
                item.expiry_date
            );

        if (
            expiry_date === null
        )
            return;


        const storage_type =
            prompt(
                "Storage Type",
                item.storage_type
            );

        if (
            storage_type === null
        )
            return;


        const barcode =
            prompt(
                "Barcode",
                item.barcode
            );

        if (
            barcode === null
        )
            return;


        try {

            await api.put(
                `/inventory/${item.id}`,
                {
                    business_id:
                        item.business_id,

                    product_name,

                    category,

                    quantity:
                        Number(quantity),

                    purchase_date,

                    expiry_date,

                    storage_type,

                    barcode
                }
            );


            alert(
                "Inventory Updated Successfully"
            );

            fetchInventory();

        } catch (err) {

            console.error(
                err.response?.data
            );

            alert(
                "Update Failed"
            );

        }

    };
// =====================================================
// DONATE / CREATE SURPLUS LISTING
// =====================================================

const handleDonate = async (item) => {

    // Pickup location
    const pickupLocation = prompt(
        "Enter Pickup Location:",
        ""
    );

    if (
        pickupLocation === null ||
        pickupLocation.trim() === ""
    ) {
        alert("Pickup location is required.");
        return;
    }


    // Available From
    const availableFrom = prompt(
        "Available From (YYYY-MM-DDTHH:MM):",
        ""
    );

    if (
        availableFrom === null ||
        availableFrom.trim() === ""
    ) {
        alert("Available from time is required.");
        return;
    }


    // Available Until
    const availableUntil = prompt(
        "Available Until (YYYY-MM-DDTHH:MM):",
        ""
    );

    if (
        availableUntil === null ||
        availableUntil.trim() === ""
    ) {
        alert("Available until time is required.");
        return;
    }


    // Validate time window
    const fromDate = new Date(
        availableFrom
    );

    const untilDate = new Date(
        availableUntil
    );


    if (
        isNaN(fromDate.getTime()) ||
        isNaN(untilDate.getTime())
    ) {
        alert(
            "Please enter valid date and time."
        );
        return;
    }


    if (
        untilDate <= fromDate
    ) {
        alert(
            "Available Until must be later than Available From."
        );
        return;
    }


    try {

        const response = await donateFood(
            item.id,
            pickupLocation,
            availableFrom,
            availableUntil
        );


        alert(
            response.message
        );


        fetchInventory();

    } catch (error) {

        console.error(
            "Donation error:",
            error
        );


        alert(
            error.response?.data?.detail ||
            "Unable to donate food."
        );

    }

};

    // =====================================================
    // AI ANALYSIS
    // =====================================================

    const handleAIAnalysis = async (
        inventoryId
    ) => {

        setSelectedAIInventory(
            inventoryId
        );

    };


    // =====================================================
    // QUICK AI ANALYSIS
    // =====================================================

    const analyzeSingleItem = async (
        item
    ) => {

        setAnalyzingId(
            item.id
        );


        try {

            const result =
                await analyzeInventoryWithAI(
                    item.id
                );


            setAIResults(
                previous => ({
                    ...previous,

                    [item.id]:
                        result
                })
            );


            setSelectedAIInventory(
                item.id
            );


        } catch (error) {

            console.error(
                error
            );

            alert(
                error.message
            );

        } finally {

            setAnalyzingId(
                null
            );

        }

    };


    return (

        <div>

            <h2 className="mb-3">
                Inventory Management
            </h2>


            {/* ================================================= */}
            {/* SEARCH */}
            {/* ================================================= */}

            <div className="mb-3">

                <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Search Product..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

            </div>


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <div className="table-responsive">

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

                            <th>AI Status</th>

                            <th>AI Recommendation</th>

                            <th>Actions</th>

                            <th>QR Code</th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredInventory.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="11"
                                    className="text-center"
                                >
                                    No Inventory Found
                                </td>

                            </tr>

                        ) : (

                            filteredInventory.map(
                                (item, index) => {

                                    const ai =
                                        aiResults[
                                            item.id
                                        ];


                                    return (

                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>


                                            <td>

                                                <strong>
                                                    {
                                                        item.product_name
                                                    }
                                                </strong>

                                            </td>


                                            <td>
                                                {
                                                    item.category
                                                }
                                            </td>


                                            <td>
                                                {
                                                    item.quantity
                                                }
                                            </td>


                                            <td>
                                                {
                                                    item.expiry_date
                                                }
                                            </td>


                                            <td>

                                                {
                                                    getStorageBadge(
                                                        item.storage_type
                                                    )
                                                }

                                            </td>


                                            <td>

                                                {
                                                    getRiskBadge(
                                                        item.expiry_date
                                                    )
                                                }

                                            </td>


                                            {/* ================================= */}
                                            {/* AI STATUS */}
                                            {/* ================================= */}

                                            <td>

                                                {ai ? (

                                                    <span
                                                        className={`badge ${
                                                            ai.waste_risk?.risk_level === "CRITICAL"
                                                                ? "bg-danger"
                                                                : ai.waste_risk?.risk_level === "HIGH"
                                                                ? "bg-warning text-dark"
                                                                : ai.waste_risk?.risk_level === "MEDIUM"
                                                                ? "bg-info text-dark"
                                                                : "bg-success"
                                                        }`}
                                                    >

                                                        🤖{" "}
                                                        {
                                                            ai.waste_risk?.risk_level ||
                                                            "ANALYZED"
                                                        }

                                                    </span>

                                                ) : (

                                                    <span className="badge bg-secondary">

                                                        Not Analyzed

                                                    </span>

                                                )}

                                            </td>


                                            {/* ================================= */}
                                            {/* AI RECOMMENDATION */}
                                            {/* ================================= */}

                                            <td>

                                                {ai ? (

                                                    ai.recommendation

                                                ) : (

                                                    <span className="text-muted">

                                                        Run AI analysis

                                                    </span>

                                                )}

                                            </td>


                                            {/* ================================= */}
                                            {/* ACTIONS */}
                                            {/* ================================= */}

                                            <td>

                                                <button
                                                    className="btn btn-warning btn-sm me-2 mb-2"
                                                    onClick={() =>
                                                        updateInventory(
                                                            item
                                                        )
                                                    }
                                                >
                                                    ✏ Edit
                                                </button>


                                                <button
                                                    className="btn btn-danger btn-sm me-2 mb-2"
                                                    onClick={() =>
                                                        deleteInventory(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    🗑 Delete
                                                </button>


                                                <button
                                                    className="btn btn-success btn-sm me-2 mb-2"
                                                    onClick={() =>
    handleDonate(item)
}
                                                    disabled={
                                                        item.is_donated
                                                    }
                                                >

                                                    {item.is_donated
                                                        ? "Donated"
                                                        : "❤ Donate"
                                                    }

                                                </button>


                                                {/* AI */}

                                                <button
                                                    className="btn btn-primary btn-sm mb-2"
                                                    onClick={() =>
                                                        analyzeSingleItem(
                                                            item
                                                        )
                                                    }
                                                    disabled={
                                                        analyzingId ===
                                                        item.id
                                                    }
                                                >

                                                    {analyzingId ===
                                                    item.id

                                                        ? "⏳ Analyzing..."

                                                        : "🤖 Analyze AI"
                                                    }

                                                </button>

                                            </td>


                                            {/* ================================= */}
                                            {/* QR */}
                                            {/* ================================= */}

                                            <td>

                                                <QRCode
                                                    value={`INV-${item.id}`}
                                                    size={60}
                                                />

                                            </td>

                                        </tr>

                                    );

                                }
                            )

                        )}

                    </tbody>

                </table>

            </div>


            {/* ================================================= */}
            {/* DETAILED AI ANALYSIS */}
            {/* ================================================= */}

            {selectedAIInventory && (

                <div className="card shadow mt-4">

                    <div className="card-header d-flex justify-content-between align-items-center">

                        <h4 className="mb-0">
                            🤖 AI Inventory Analysis
                        </h4>


                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                                setSelectedAIInventory(
                                    null
                                )
                            }
                        >
                            ✕ Close
                        </button>

                    </div>


                    <div className="card-body">

                        <AIAnalysis
                            inventoryId={
                                selectedAIInventory
                            }
                        />

                    </div>

                </div>

            )}

        </div>
    );
}


export default InventoryTable;