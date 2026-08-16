import { useEffect, useState } from "react";
import { getExpiryAlerts } from "../services/expiryService";

function ExpiryAlert() {

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <p>Loading expiry alerts...</p>
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
                                <span className="risk-text">
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