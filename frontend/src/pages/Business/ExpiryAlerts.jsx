import BusinessLayout from "../../layouts/BusinessLayout";
import ExpiryAlert from "../../components/ExpiryAlert";
import "./ExpiryAlerts.css";
export default function ExpiryAlerts() {

    return (

        <BusinessLayout>

            <div className="expiry-page">

                <div className="expiry-page-header">

                    <div>
                        <h2>Expiry Alerts</h2>

                        <p>
                            Monitor food items that are expired
                            or approaching their expiry date.
                        </p>
                    </div>

                </div>

                <ExpiryAlert />

            </div>

        </BusinessLayout>

    );
}