import { useState } from "react";
import api from "../services/api";

function CSVUpload() {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadFile = async () => {

        if (!file) {
            alert("Please select a CSV file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {

            setLoading(true);

            await api.post(
                "/inventory/upload-csv",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("CSV Uploaded Successfully ✅");

            setFile(null);

        } catch (error) {

    console.log(error);

    console.log(error.response);

    alert(
        error.response?.data?.detail ||
        JSON.stringify(error.response?.data) ||
        error.message
    );

} finally {

            setLoading(false);

        }

    };

    return (

        <div className="card shadow-sm mb-4">

            <div className="card-body">

                <h4>Bulk Inventory Upload</h4>

                <p className="text-muted">
                    Upload multiple inventory items using a CSV file.
                </p>

                <input
                    className="form-control"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <button
                    className="btn btn-success mt-3"
                    onClick={uploadFile}
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload CSV"}
                </button>

            </div>

        </div>

    );

}

export default CSVUpload;