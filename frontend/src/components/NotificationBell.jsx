import { useEffect, useRef, useState } from "react";
import { getNotifications } from "../services/donationService";
import "../styles/shell.css";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const dropdownRef = useRef(null);

    // ==========================================
    // LOAD NOTIFICATIONS
    // ==========================================

    const loadNotifications = async () => {

        try {

            setLoading(true);

            const data = await getNotifications();

            console.log("Notifications:", data);

            setNotifications(data || []);

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

            setNotifications([]);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD WHEN COMPONENT STARTS
    // ==========================================

    useEffect(() => {

        loadNotifications();

    }, []);


    // ==========================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // ==========================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {

                setOpen(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // ==========================================
    // NOTIFICATION ICON
    // ==========================================

    const getIcon = (type) => {

        if (type === "accepted") {
            return "🤝";
        }

        if (type === "scheduled") {
            return "📅";
        }

        if (type === "completed") {
            return "✅";
        }

        return "🔔";

    };


    // ==========================================
    // NOTIFICATION TITLE
    // ==========================================

    const getTitle = (type) => {

        if (type === "accepted") {
            return "Donation Accepted";
        }

        if (type === "scheduled") {
            return "Pickup Scheduled";
        }

        if (type === "completed") {
            return "Pickup Completed";
        }

        return "Notification";

    };


    return (

        <div
            ref={dropdownRef}
            style={{
                position: "fixed",
                top: "18px",
                right: "28px",
                zIndex: 9999
            }}
        >

            {/* ======================================
                BELL BUTTON
            ====================================== */}

            <button
                className="fb-bell-btn"
                onClick={() => {

                    setOpen(!open);

                    if (!open) {
                        loadNotifications();
                    }

                }}
                title="Notifications"
            >

                🔔

                {/* Notification count */}

                {notifications.length > 0 && (
                    <span className="fb-bell-badge">
                        {notifications.length > 99
                            ? "99+"
                            : notifications.length}
                    </span>
                )}

            </button>


            {/* ======================================
                NOTIFICATION DROPDOWN
            ====================================== */}

            {open && (

                <div className="fb-bell-dropdown">

                    {/* Header */}

                    <div className="fb-bell-header">

                        <strong>
                            🔔 Notifications
                        </strong>

                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={loadNotifications}
                        >
                            🔄
                        </button>

                    </div>


                    {/* Loading */}

                    {loading && (

                        <div className="text-center p-4">

                            <div
                                className="spinner-border spinner-border-sm text-primary"
                            />

                            <div className="small text-muted mt-2">
                                Loading notifications...
                            </div>

                        </div>

                    )}


                    {/* No notifications */}

                    {!loading &&
                        notifications.length === 0 && (

                            <div className="fb-empty-state">
                                <div className="fb-empty-icon">🔕</div>
                                <div>No new notifications</div>
                            </div>

                        )}


                    {/* Notifications */}

                    {!loading &&
                        notifications.length > 0 && (

                            <div
                                style={{
                                    maxHeight: "400px",
                                    overflowY: "auto"
                                }}
                            >

                                {notifications.map(
                                    (notification) => (

                                        <div
                                            key={`${notification.id}-${notification.type}`}
                                            className="fb-bell-item"
                                        >

                                            <div className="fb-bell-icon">
                                                {getIcon(notification.type)}
                                            </div>

                                            <div>
                                                <div className="fw-semibold">
                                                    {getTitle(notification.type)}
                                                </div>

                                                <div className="text-muted small mt-1">
                                                    {notification.message}
                                                </div>
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>

            )}

        </div>

    );

}

export default NotificationBell;