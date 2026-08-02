import { Link, useLocation, useNavigate } from "react-router-dom";

function NGOLayout({ children }) {

    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        {
            name: "Dashboard",
            path: "/ngo/dashboard"
        },
        {
            name: "Available Donations",
            path: "/ngo/available-donations"
        },
        {
            name: "Accepted Donations",
            path: "/ngo/accepted-donations"
        },
        {
            name: "Pickup Schedule",
            path: "/ngo/pickup-schedule"
        },
        {
            name: "History",
            path: "/ngo/history"
        },
        {
            name: "Profile",
            path: "/ngo/profile"
        }
    ];

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/");

    };

    return (

        <div className="d-flex">

            {/* Sidebar */}

            <div
    className="text-white p-3 d-flex flex-column"
    style={{
        width: "250px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #2563EB, #1E40AF)"
    }}
>

                <h2 className="mb-4">
                    Food
                    Redistribution NGO
                </h2>

                {/* Menu */}

                <div className="flex-grow-1">

                    {menu.map((item) => (

                        <Link
                            key={item.path}
                            to={item.path}
                            className={`d-block text-decoration-none p-2 rounded mb-2 ${
                                location.pathname === item.path
                                    ? "bg-light text-success fw-bold"
                                    : "text-white"
                            }`}
                        >
                            {item.name}
                        </Link>

                    ))}

                </div>

                {/* Logout Button */}

                <button
                    className="btn btn-danger w-100 mt-auto"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            {/* Main Content */}

            <div className="flex-grow-1 p-4 bg-light">

                {children}

            </div>

        </div>

    );

}

export default NGOLayout;