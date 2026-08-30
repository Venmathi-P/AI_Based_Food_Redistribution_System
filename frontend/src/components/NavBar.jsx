import NotificationBell from "./NotificationBell";

function Navbar() {
    return (
        <div className="bg-white p-3 rounded shadow-sm mb-4">

            <div className="d-flex justify-content-between align-items-center">

                {/* LEFT SIDE */}
                <div>
                    <h3 className="mb-0">
                        Food Rescue Dashboard
                    </h3>

                    <small className="text-muted">
                        Connecting surplus food with NGOs
                    </small>
                </div>

                {/* RIGHT SIDE */}
                <NotificationBell />

            </div>

        </div>
    );
}

export default Navbar;