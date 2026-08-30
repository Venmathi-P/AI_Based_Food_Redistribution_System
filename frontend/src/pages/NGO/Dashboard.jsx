import { useEffect, useState } from "react";

import NGOLayout from "../../layouts/NGOLayout";
import DashboardCard from "../../components/DashboardCard";

import { getNotifications,getAllDonations } from "../../services/donationService";

import {
    getNGODashboardStats
} from "../../services/ngoAnalyticsService";


function Dashboard() {

    // =====================================================
    // NOTIFICATIONS STATE
    // =====================================================

    const [notifications, setNotifications] = useState([]);
    const [recentDonations, setRecentDonations] = useState([]);

const [loadingDonations, setLoadingDonations] =
    useState(true);
    const [loadingNotifications, setLoadingNotifications] =
        useState(true);


    // =====================================================
    // DASHBOARD STATS STATE
    // =====================================================

    const [stats, setStats] = useState({

        available_donations: 0,

        accepted_donations: 0,

        scheduled_pickups: 0,

        meals_served: 0

    });


    const [loadingStats, setLoadingStats] =
        useState(true);


    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        loadNotifications();

        loadDashboardStats();

        loadRecentDonations();

    }, []);


    // =====================================================
    // LOAD NOTIFICATIONS
    // =====================================================

    const loadNotifications = async () => {

        try {

            setLoadingNotifications(true);

            const data =
                await getNotifications();

            console.log(
                "NGO Notifications:",
                data
            );

            setNotifications(data);

        } catch (error) {

            console.error(
                "Failed to load NGO notifications:",
                error
            );

            setNotifications([]);

        } finally {

            setLoadingNotifications(false);

        }

    };
    // =====================================================
// LOAD RECENT DONATIONS
// =====================================================

const loadRecentDonations = async () => {

    try {

        setLoadingDonations(true);

        const data = await getAllDonations();

        console.log(
            "NGO Recent Donations:",
            data
        );

        // Show latest donations first
        const sortedDonations = [...data].sort(
            (a, b) =>
                (b.id || b.donation_id || 0) -
                (a.id || a.donation_id || 0)
        );

        setRecentDonations(
            sortedDonations.slice(0, 5)
        );

    } catch (error) {

        console.error(
            "Failed to load recent donations:",
            error
        );

        setRecentDonations([]);

    } finally {

        setLoadingDonations(false);

    }

};


    // =====================================================
    // LOAD DASHBOARD STATS
    // =====================================================

    const loadDashboardStats = async () => {

        try {

            setLoadingStats(true);

            const data =
                await getNGODashboardStats();

            console.log(
                "NGO Dashboard Stats:",
                data
            );

            setStats(data);

        } catch (error) {

            console.error(
                "Failed to load NGO dashboard stats:",
                error
            );

        } finally {

            setLoadingStats(false);

        }

    };


    // =====================================================
    // REFRESH EVERYTHING
    // =====================================================

    const refreshDashboard = () => {

        loadNotifications();

        loadDashboardStats();

        loadRecentDonations();

    };


    return (

        <NGOLayout>

            <div className="container-fluid fb-animate-in">


                {/* ================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================= */}

                <div className="fb-page-header">

                    <div>

                        <h2>
                            NGO Dashboard
                        </h2>

                        <p>
                            Food redistribution and impact overview
                        </p>

                    </div>


                    <div className="fb-page-actions">
                        <button
                            className="btn btn-outline-primary"
                            onClick={refreshDashboard}
                        >
                            🔄 Refresh
                        </button>
                    </div>

                </div>


                {/* ================================================= */}
                {/* DASHBOARD CARDS */}
                {/* ================================================= */}

                <div className="row g-4">


                    {/* AVAILABLE DONATIONS */}

                    <div className="col-md-3">

                        <DashboardCard

                            icon="🧺"

                            title="Available Donations"

                            value={
                                loadingStats
                                    ? "..."
                                    : stats.available_donations
                            }

                            subtitle="Ready to Claim"

                            color="#4F46E5"

                        />

                    </div>


                    {/* ACCEPTED */}

                    <div className="col-md-3">

                        <DashboardCard

                            icon="✅"

                            title="Accepted"

                            value={
                                loadingStats
                                    ? "..."
                                    : stats.accepted_donations
                            }

                            subtitle="Your Donations"

                            color="#0d6efd"

                        />

                    </div>


                    {/* SCHEDULED */}

                    <div className="col-md-3">

                        <DashboardCard

                            icon="🚚"

                            title="Scheduled Pickups"

                            value={
                                loadingStats
                                    ? "..."
                                    : stats.scheduled_pickups
                            }

                            subtitle="Upcoming"

                            color="#fd7e14"

                        />

                    </div>


                    {/* MEALS */}

                    <div className="col-md-3">

                        <DashboardCard

                            icon="🍽️"

                            title="Meals Served"

                            value={
                                loadingStats
                                    ? "..."
                                    : stats.meals_served
                            }

                            subtitle="Estimated"

                            color="#6f42c1"

                        />

                    </div>

                </div>


                {/* ================================================= */}
                {/* RECENT DONATIONS */}
                {/* ================================================= */}

                <div className="card mt-4">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <h4 className="mb-1">
                                    Recent Donations
                                </h4>

                                <small className="text-muted">
                                    Latest food redistribution activity
                                </small>

                            </div>

                        </div>


                        <div className="table-responsive">

                            <table className="table table-striped mt-3">

                                <thead>

                                    <tr>

                                        <th>
                                            Donor
                                        </th>

                                        <th>
                                            Food
                                        </th>

                                        <th>
                                            Quantity
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

    {loadingDonations ? (

        <tr>

            <td
                colSpan="4"
                className="text-center py-4"
            >

                <div
                    className="spinner-border spinner-border-sm text-primary me-2"
                    role="status"
                />

                Loading recent donations...

            </td>

        </tr>

    ) : recentDonations.length === 0 ? (

        <tr>

            <td
                colSpan="4"
                className="text-center text-muted py-4"
            >

                No donations available yet.

            </td>

        </tr>

    ) : (

        recentDonations.map((donation) => (

            <tr
                key={
                    donation.id ||
                    donation.donation_id
                }
            >

                {/* DONOR */}

                <td>

                    <strong>
                        {donation.business_name ||
                         donation.donor_name ||
                         `Business ${donation.business_id || ""}`}
                    </strong>

                </td>


                {/* FOOD */}

                <td>

                    🍚{" "}

                    <strong>
                        {donation.product_name ||
                         donation.food_type ||
                         donation.food_name ||
                         "Food Donation"}
                    </strong>

                </td>


                {/* QUANTITY */}

                <td>

                    {donation.quantity ?? "-"} kg

                </td>


                {/* STATUS */}

                <td>

                    <span
                        className={`badge ${
                            donation.status === "completed"
                                ? "bg-success"
                                : donation.status === "accepted"
                                    ? "bg-primary"
                                    : donation.status === "scheduled"
                                        ? "bg-warning text-dark"
                                        : "bg-secondary"
                        }`}
                    >

                        {donation.status
                            ? donation.status
                                .charAt(0)
                                .toUpperCase() +
                              donation.status.slice(1)
                            : "Available"
                        }

                    </span>

                </td>

            </tr>

        ))

    )}

</tbody>

                            </table>

                        </div>

                    </div>

                </div>




            </div>

        </NGOLayout>

    );

}


export default Dashboard;