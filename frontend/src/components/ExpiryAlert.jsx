import { useEffect, useState } from "react";
import { getExpiryAlerts } from "../services/expiryService";

function ExpiryAlert() {

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const riskClass = (risk) => {
        const r = String(risk || "").toLowerCase();
        if (r.includes("expired")) return "fb-risk-expired";
        if (r.includes("high")) return "fb-risk-high";
        if (r.includes("medium") || r.includes("moderate")) return "fb-risk-medium";
        return "fb-risk-low";
    };

    useEffect(() => {

        const businessId = localStorage.getItem("user_id");

        if (!businessId) {
            console.error("Business ID not found");
            setLoading(false);
            return;
        }

        getExpiryAlerts(businessId)
            .then((res) => {

                console.log("Expiry API Response:", res.data);

                if (Array.isArray(res.data)) {
                    setAlerts(res.data);
                } else {
                    setAlerts([]);
                }

            })
            .catch((error) => {

                console.error("Expiry API Error:", error);
                setAlerts([]);

            })
            .finally(() => {

                setLoading(false);

            });

    }, []);


    if (loading) {
        return (
            <div className="expiry-section">
                <h3>⚠️ Expiry Alerts</h3>
                <div className="fb-skeleton" style={{ height: 18, width: "40%", marginBottom: 14 }} />
                <div className="row g-3">
                    {[1, 2, 3, 4].map((n) => (
                        <div className="col-md-3" key={n}>
                            <div className="fb-skeleton" style={{ height: 130, borderRadius: 12 }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    return (
        <div className="expiry-section">

            <div className="expiry-header">

                <div>
                    <h3>⚠️ Expiry Alerts</h3>

                    <p>
                        Food items that need attention
                    </p>
                </div>

                <span className="expiry-count">
                    {alerts.length} Alerts
                </span>

            </div>


            {alerts.length === 0 ? (

                <div className="no-expiry-alerts">
                    ✓ No expiry alerts
                </div>

            ) : (

                <div className="expiry-alert-grid">

                    {alerts.map((item, index) => (

                        <div
                            className="expiry-card"
                            key={index}
                        >

                            <h4>
                                {item.product_name}
                            </h4>

                            <p>
                                <strong>Expiry:</strong>{" "}
                                {item.expiry_date}
                            </p>

                            <p>
                                <strong>Days Left:</strong>{" "}
                                {item.days_left}
                            </p>

                            <p>
                                <strong>Risk:</strong>{" "}
                                <span className={`fb-risk-pill ${riskClass(item.risk)}`}>
                                    {item.risk}
                                </span>
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default ExpiryAlert;