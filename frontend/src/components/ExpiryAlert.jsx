import { useEffect, useState } from "react";
import { getExpiryAlerts } from "../services/expiryService";

function ExpiryAlert() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const businessId = localStorage.getItem("user_id");

    console.log("Business ID:", businessId);

    if (!businessId) {
      console.error("Business ID not found in localStorage");
      setLoading(false);
      return;
    }

    getExpiryAlerts(businessId)
      .then((res) => {
        console.log("Expiry API Response:", res.data);

        if (Array.isArray(res.data)) {
          setAlerts(res.data);
        } else {
          console.error("Unexpected API response:", res.data);
          setAlerts([]);
        }
      })
      .catch((err) => {
        console.error("Expiry API Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading expiry alerts...</p>;
  }

  return (
    <div className="expiry-alert">
      <h3>⚠️ Expiry Alerts</h3>

      {alerts.length === 0 ? (
        <p>No expiry alerts</p>
      ) : (
        alerts.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <h4>{item.product_name}</h4>

            <p>
              <strong>Expiry:</strong> {item.expiry_date}
            </p>

            <p>
              <strong>Days Left:</strong> {item.days_left}
            </p>

            <p>
              <strong>Risk:</strong> {item.risk}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default ExpiryAlert;