import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";
import "../styles/shell.css";

function NGOLayout({ children }) {

    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        { name: "Dashboard", path: "/ngo/dashboard", icon: "bi-speedometer2" },
        { name: "Available Donations", path: "/ngo/available-donations", icon: "bi-basket" },
        { name: "Accepted Donations", path: "/ngo/accepted-donations", icon: "bi-check2-circle" },
        { name: "Pickup Schedule", path: "/ngo/pickup-schedule", icon: "bi-truck" },
        { name: "History", path: "/ngo/history", icon: "bi-clock-history" },
        { name: "Profile", path: "/ngo/profile", icon: "bi-person-circle" },
        {
    name: "My Requirements",
    path: "/ngo/requirements",
    icon: "bi-clipboard-check"
},
        { name: "AI Matching", path: "/ngo/matching", icon: "bi-robot" },
        { name: "Sustainability", path: "/ngo/sustainability", icon: "bi-tree" },
    ];

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");

        navigate("/");

    };

    return (

        <div className="fb-shell">

            <NotificationBell />

            {/* =========================================
                SIDEBAR
            ========================================= */}

            <div className="fb-sidebar fb-sidebar--ngo">

                <div className="fb-sidebar-brand">
                    <div className="fb-sidebar-brand-mark">🌱</div>
                    <div className="fb-sidebar-brand-text">
                        FoodBridge
                        <span>NGO Portal</span>
                    </div>
                </div>

                <nav className="fb-sidebar-nav">
                    <div className="fb-sidebar-nav-label">Main Menu</div>

                    {menu.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`fb-sidebar-link ${location.pathname === item.path ? "active" : ""}`}
                        >
                            <i className={`bi ${item.icon}`}></i>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="fb-sidebar-footer">
                    <button className="fb-sidebar-logout" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </button>
                </div>

            </div>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <div className="fb-main">
                <div className="fb-content">
                    {children}
                </div>
            </div>

        </div>

    );

}

export default NGOLayout;
