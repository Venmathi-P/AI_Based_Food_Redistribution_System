import { Link } from "react-router-dom";

export default function Sidebar() {

    return (

        <div className="sidebar">

            <div>

                <h4 className="sidebar-logo">
                    🌉 Food Redistribution AI
                </h4>

                <Link to="/business/dashboard">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                </Link>

                <Link to="/inventory">
                    <i className="bi bi-box-seam me-2"></i>
                    Inventory
                </Link>

                <Link to="/expiry-alerts">
                    <i className="bi bi-list-check me-2"></i>
                    Expiry Alerts
                </Link>

            </div>

        </div>

    );
}