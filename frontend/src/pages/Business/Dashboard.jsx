import "./Dashboard.css";
import BusinessLayout from "../../layouts/BusinessLayout";
import DashboardCard from "../../components/DashboardCard";
import FoodChart from "../../components/FoodChart";
import RecentTable from "../../components/RecentTable";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/dashboard";

import {
    getScheduledDonations,
    getNotifications
} from "../../services/donationService";


export default function Dashboard() {

    // =====================================================
    // DASHBOARD STATS
    // =====================================================

    const [stats, setStats] = useState({
        listings: 0,
        food_rescued: 0,
        expiring: 0,
        ngos: 0
    });


    // =====================================================
    // SCHEDULED DONATIONS
    // =====================================================

    const [scheduledDonations, setScheduledDonations] = useState([]);


    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    const [notifications, setNotifications] = useState([]);


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    // =====================================================
    // LOAD EVERYTHING
    // =====================================================

    useEffect(() => {

        loadDashboard();
        loadScheduledDonations();
        loadNotifications();

    }, []);


    // =====================================================
    // LOAD DASHBOARD STATS
    // =====================================================

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const data = await getDashboardStats();

            console.log("Business Dashboard Stats:", data);

            setStats({
                listings: data.listings ?? 0,
                food_rescued: data.food_rescued ?? 0,
                expiring: data.expiring ?? 0,
                ngos: data.ngos ?? 0
            });

        } catch (error) {

            console.error(
                "Dashboard API Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD SCHEDULED DONATIONS
    // =====================================================

    const loadScheduledDonations = async () => {

        try {

            const data = await getScheduledDonations();

            console.log(
                "Scheduled Donations:",
                data
            );

            setScheduledDonations(data);

        } catch (error) {

            console.error(
                "Scheduled Donations Error:",
                error
            );

            setScheduledDonations([]);

        }

    };


    // =====================================================
    // LOAD NOTIFICATIONS
    // =====================================================

    const loadNotifications = async () => {

        try {

            const data = await getNotifications();

            console.log(
                "Business Notifications:",
                data
            );

            setNotifications(data);

        } catch (error) {

            console.error(
                "Notification Error:",
                error
            );

            setNotifications([]);

        }

    };


    // =====================================================
    // INVENTORY HEALTH CALCULATION
    // =====================================================

    const totalListings = Number(stats.listings) || 0;

    const expiringItems = Number(stats.expiring) || 0;


    let inventoryHealth = 100;

    if (totalListings > 0) {

        inventoryHealth =
            Math.max(
                0,
                Math.round(
                    ((totalListings - expiringItems) /
                        totalListings) *
                    100
                )
            );

    }


    // =====================================================
    // WASTE RISK
    // =====================================================

    let wasteRisk = "Low";

    let wasteRiskClass = "bg-success";

    if (expiringItems > 0) {

        const riskPercentage =
            totalListings > 0
                ? (expiringItems / totalListings) * 100
                : 0;


        if (riskPercentage >= 50) {

            wasteRisk = "High";
            wasteRiskClass = "bg-danger";

        } else if (riskPercentage >= 25) {

            wasteRisk = "Medium";
            wasteRiskClass = "bg-warning text-dark";

        }

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <BusinessLayout>

            <div className="container-fluid fb-animate-in">


                {/* ================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================= */}

                <div className="fb-page-header">

                    <div>

                        <h2>
                            Business Dashboard
                        </h2>

                        <p>
                            Monitor inventory health, waste risk
                            and food redistribution.
                        </p>

                    </div>


                    <div className="fb-page-actions">

                        <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                                loadDashboard();
                                loadScheduledDonations();
                                loadNotifications();
                            }}
                        >
                            🔄 Refresh
                        </button>
                        
                        

                    </div>

                </div>



                {/* ================================================= */}
                {/* DASHBOARD STAT CARDS */}
                {/* ================================================= */}

                <div className="row g-4">


                    {/* ACTIVE LISTINGS */}

                    <div className="col-md-6 col-lg-3">

                        <DashboardCard
                            icon="📦"
                            title="Listings Active"
                            value={
                                loading
                                    ? "..."
                                    : stats.listings
                            }
                            subtitle="Available surplus food"
                            color="#4F46E5"
                        />

                    </div>


                    {/* FOOD RESCUED */}

                    <div className="col-md-6 col-lg-3">

                        <DashboardCard
                            icon="♻️"
                            title="Food Rescued"
                            value={
                                loading
                                    ? "..."
                                    : `${stats.food_rescued} kg`
                            }
                            subtitle="Food diverted from waste"
                            color="#fd7e14"
                        />

                    </div>


                    {/* EXPIRING */}

                    <div className="col-md-6 col-lg-3">

                        <DashboardCard
                            icon="⏰"
                            title="Expiring Soon"
                            value={
                                loading
                                    ? "..."
                                    : stats.expiring
                            }
                            subtitle="Requires attention"
                            color="#dc3545"
                        />

                    </div>


                    {/* NGOS */}

                    <div className="col-md-6 col-lg-3">

                        <DashboardCard
                            icon="🤝"
                            title="NGOs Active"
                            value={
                                loading
                                    ? "..."
                                    : stats.ngos
                            }
                            subtitle="Connected organizations"
                            color="#6f42c1"
                        />

                    </div>

                </div>



                {/* ================================================= */}
                {/* INVENTORY HEALTH + WASTE RISK */}
                {/* ================================================= */}

                <div className="row mt-4 g-4">


                    {/* INVENTORY HEALTH */}

                    <div className="col-lg-6">

                        <div className="dashboard-section h-100">

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <div>

                                    <h4 className="mb-1">
                                        📦 Inventory Health
                                    </h4>

                                    <small className="text-muted">
                                        Current inventory condition
                                    </small>

                                </div>


                                <span
                                    className={`badge ${
                                        inventoryHealth >= 75
                                            ? "bg-success"
                                            : inventoryHealth >= 50
                                                ? "bg-warning text-dark"
                                                : "bg-danger"
                                    }`}
                                >
                                    {inventoryHealth}%
                                </span>

                            </div>


                            {/* HEALTH PROGRESS */}

                            <div className="mb-3">

                                <div
                                    className="progress"
                                    style={{
                                        height: "25px"
                                    }}
                                >

                                    <div
                                        className={`progress-bar ${
                                            inventoryHealth >= 75
                                                ? "bg-success"
                                                : inventoryHealth >= 50
                                                    ? "bg-warning"
                                                    : "bg-danger"
                                        }`}
                                        role="progressbar"
                                        style={{
                                            width: `${inventoryHealth}%`
                                        }}
                                    >

                                        {inventoryHealth}% Healthy

                                    </div>

                                </div>

                            </div>


                            <div className="row g-3">


                                <div className="col-6">

                                    <div className="border rounded p-3">

                                        <small className="text-muted">
                                            Active Items
                                        </small>

                                        <h3 className="mb-0">
                                            {stats.listings}
                                        </h3>

                                    </div>

                                </div>


                                <div className="col-6">

                                    <div className="border rounded p-3">

                                        <small className="text-muted">
                                            Expiring Items
                                        </small>

                                        <h3 className="mb-0 text-danger">
                                            {stats.expiring}
                                        </h3>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* WASTE RISK */}

                    <div className="col-lg-6">

                        <div className="dashboard-section h-100">

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <div>

                                    <h4 className="mb-1">
                                        ⚠️ Waste Risk Overview
                                    </h4>

                                    <small className="text-muted">
                                        Risk based on expiring inventory
                                    </small>

                                </div>


                                <span
                                    className={`badge ${wasteRiskClass}`}
                                    style={{
                                        fontSize: "14px"
                                    }}
                                >
                                    {wasteRisk} Risk
                                </span>

                            </div>


                            {/* RISK BAR */}

                            <div className="mb-3">

                                <div className="d-flex justify-content-between mb-1">

                                    <small>
                                        Expiry Risk
                                    </small>

                                    <small>
                                        {totalListings > 0
                                            ? Math.round(
                                                (expiringItems /
                                                    totalListings) *
                                                100
                                            )
                                            : 0
                                        }%
                                    </small>

                                </div>


                                <div
                                    className="progress"
                                    style={{
                                        height: "25px"
                                    }}
                                >

                                    <div
                                        className={`progress-bar ${wasteRiskClass}`}
                                        style={{
                                            width: `${
                                                totalListings > 0
                                                    ? Math.min(
                                                        100,
                                                        (expiringItems /
                                                            totalListings) *
                                                        100
                                                    )
                                                    : 0
                                            }%`
                                        }}
                                    />

                                </div>

                            </div>


                            {/* RISK INFORMATION */}

                            <div className="alert alert-light border mb-0">

                                {expiringItems === 0 ? (

                                    <>
                                        <strong>
                                            ✅ No immediate waste risk
                                        </strong>

                                        <br />

                                        <small className="text-muted">
                                            No inventory items are currently
                                            marked as expiring soon.
                                        </small>
                                    </>

                                ) : (

                                    <>
                                        <strong>
                                            ⚠️ {expiringItems} item(s) need
                                            attention
                                        </strong>

                                        <br />

                                        <small className="text-muted">
                                            Consider donating expiring
                                            inventory before it becomes waste.
                                        </small>
                                    </>

                                )}

                            </div>

                        </div>

                    </div>

                </div>



                {/* ================================================= */}
                {/* INVENTORY / FOOD CHART */}
                {/* ================================================= */}

                <div className="row mt-4">

                    <div className="col-12">

                        <div className="dashboard-section">

                            <div className="mb-3">

                                <h4 className="mb-1">
                                    📊 Inventory Overview
                                </h4>

                                <small className="text-muted">
                                    Food inventory distribution
                                </small>

                            </div>

                            <FoodChart />

                        </div>

                    </div>

                </div>
                {/* ============================= */}
{/* WASTE PREVENTION ACTION PLAN */}
{/* ============================= */}

<div className="row mt-4">

    <div className="col-12">

        <div className="dashboard-section">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                    <h4 className="mb-1">
                        🌱 Waste Prevention Action Plan
                    </h4>

                    <small className="text-muted">
                        Recommended actions to reduce food waste
                    </small>
                </div>

                <span className="badge bg-success">
                    AI Recommendations
                </span>

            </div>


            <div className="row g-3">

                {/* DONATE */}

                <div className="col-md-4">

                    <div
                        className="border rounded p-4 h-100"
                        style={{
                            backgroundColor: "#f8fff9"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "32px"
                            }}
                        >
                            🤝
                        </div>

                        <h5 className="mt-2">
                            Donate Expiring Food
                        </h5>

                        <p className="text-muted mb-3">
                            Food items approaching expiry
                            should be listed for NGO redistribution.
                        </p>

                        <div className="d-flex justify-content-between">

                            <span>
                                Items requiring donation
                            </span>

                            <strong className="text-danger">
                                {stats.expiring}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* MONITOR */}

                <div className="col-md-4">

                    <div
                        className="border rounded p-4 h-100"
                        style={{
                            backgroundColor: "#fffaf0"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "32px"
                            }}
                        >
                            📊
                        </div>

                        <h5 className="mt-2">
                            Monitor Inventory
                        </h5>

                        <p className="text-muted mb-3">
                            Regularly monitor inventory levels
                            and expiry dates to prevent waste.
                        </p>

                        <div className="d-flex justify-content-between">

                            <span>
                                Active inventory
                            </span>

                            <strong>
                                {stats.listings}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* AI MATCHING */}

                <div className="col-md-4">

                    <div
                        className="border rounded p-4 h-100"
                        style={{
                            backgroundColor: "#f5f8ff"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "32px"
                            }}
                        >
                            🤖
                        </div>

                        <h5 className="mt-2">
                            AI NGO Matching
                        </h5>

                        <p className="text-muted mb-3">
                            Match surplus food with NGOs
                            based on food type, quantity and location.
                        </p>

                        <div className="d-flex justify-content-between">

                            <span>
                                Connected NGOs
                            </span>

                            <strong>
                                {stats.ngos}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* ACTION MESSAGE */}

            {stats.expiring > 0 && (

                <div className="alert alert-warning mt-3 mb-0">

                    ⚠️ <strong>
                        Priority Action:
                    </strong>

                    {" "}

                    {stats.expiring} inventory item(s) are
                    approaching expiry. Consider creating
                    surplus donations and using AI matching
                    to redistribute them before they become waste.

                </div>

            )}

        </div>

    </div>

</div>



                {/* ================================================= */}
                {/* DONATION & PICKUP TRACKER */}
                {/* ================================================= */}

                <div className="row mt-4">

                    <div className="col-12">

                        <div className="dashboard-section">


                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <div>

                                    <h4 className="mb-1">
                                        🤝 Donation & Pickup Tracking
                                    </h4>

                                    <small className="text-muted">
                                        Track NGO acceptance and scheduled pickups
                                    </small>

                                </div>


                                <span className="badge bg-primary">

                                    {scheduledDonations.length}
                                    {" "}
                                    Scheduled

                                </span>

                            </div>



                            {scheduledDonations.length === 0 ? (

                                <div className="alert alert-light border mb-0">

                                    No pickups have been scheduled yet.

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle">

                                        <thead>

                                            <tr>

                                                <th>Food</th>

                                                <th>Quantity</th>

                                                <th>NGO</th>

                                                <th>Pickup Date</th>

                                                <th>Pickup Time</th>

                                                <th>Status</th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {scheduledDonations.map(
                                                (item) => (

                                                    <tr key={item.id}>

                                                        <td>

                                                            <strong>
                                                                {
                                                                    item.product_name
                                                                }
                                                            </strong>

                                                        </td>


                                                        <td>
                                                            {item.quantity}
                                                        </td>


                                                        <td>
                                                            NGO {item.ngo_id}
                                                        </td>


                                                        <td>
                                                            {item.pickup_date}
                                                        </td>


                                                        <td>
                                                            {item.pickup_time}
                                                        </td>


                                                        <td>

                                                            <span className="badge bg-success">

                                                                {
                                                                    item.status
                                                                }

                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                </div>



                {/* ================================================= */}
                {/* RECENT INVENTORY */}
                {/* ================================================= */}

                <div className="row mt-4">

                    <div className="col-12">

                        <div className="dashboard-section">

                            <h4 className="mb-3">
                                📋 Recent Inventory
                            </h4>

                            <RecentTable />

                        </div>

                    </div>

                </div>


            </div>

        </BusinessLayout>

    );

}