import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";
import "../styles/shell.css";

export default function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        {
            name: "Dashboard",
            icon: "bi-speedometer2",
            path: "/business/dashboard"
        },
        {
            name: "Inventory",
            icon: "bi-box-seam",
            path: "/inventory"
        },
        {
            name: "Expiry Alerts",
            icon: "bi-exclamation-triangle",
            path: "/expiry-alerts"
        }
    ];

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");
        localStorage.removeItem("business_name");
        localStorage.removeItem("email");

        navigate("/");

    };

    return (

        <div className="fb-shell">

            <NotificationBell />

            {/* =========================================
                BUSINESS SIDEBAR
            ========================================= */}

            <div className="fb-sidebar fb-sidebar--business">

                {/* BRAND */}

                <div className="fb-sidebar-brand">

                    <div className="fb-sidebar-brand-mark">
                        🌉
                    </div>

                    <div className="fb-sidebar-brand-text">

                        FoodBridge

                        <span>
                            Business Portal
                        </span>

                    </div>

                </div>


                {/* MENU */}

                <nav className="fb-sidebar-nav">

                    <div className="fb-sidebar-nav-label">
                        Main Menu
                    </div>

                    {menu.map((item) => (

                        <Link
                            key={item.path}
                            to={item.path}
                            className={`fb-sidebar-link ${
                                location.pathname === item.path
                                    ? "active"
                                    : ""
                            }`}
                        >

                            <i className={`bi ${item.icon}`}></i>

                            <span>
                                {item.name}
                            </span>

                        </Link>

                    ))}

                </nav>


                {/* LOGOUT */}

                <div className="fb-sidebar-footer">

                    <button
                        className="fb-sidebar-logout"
                        onClick={handleLogout}
                    >

                        <i className="bi bi-box-arrow-right"></i>

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </div>

        </div>
    );
}