import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";
import "../styles/shell.css";

function BusinessLayout({ children }) {

    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        {
            name: "Dashboard",
            path: "/business/dashboard",
            icon: "bi-speedometer2"
        },
        {
            name: "Inventory",
            path: "/inventory",
            icon: "bi-box-seam"
        },
        {
            name: "Expiry Alerts",
            path: "/expiry-alerts",
            icon: "bi-exclamation-triangle"
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

            <div className="fb-sidebar fb-sidebar--business">

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


            <div className="fb-main">

                <div className="fb-content">

                    {children}

                </div>

            </div>

        </div>
    );
}

export default BusinessLayout;