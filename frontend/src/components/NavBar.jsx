import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div
            className="d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm mb-4"
        >
            <div>
                <h3 className="mb-0">
                    Food Rescue Dashboard
                </h3>

                <small className="text-muted">
                    Connecting surplus food with NGOs
                </small>
            </div>

            <div className="d-flex gap-3 align-items-center">

                <Link to="/business/dashboard">
                    Dashboard
                </Link>

                <Link to="/inventory">
                    Inventory
                </Link>

                <Link to="/">
                    Logout
                </Link>

            </div>
        </div>
    );
}

export default Navbar;