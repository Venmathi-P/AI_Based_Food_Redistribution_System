import "./Dashboard.css";
import BusinessLayout from "../../layouts/BusinessLayout";
import DashboardCard from "../../components/DashboardCard";
import FoodChart from "../../components/FoodChart";
import RecentTable from "../../components/RecentTable";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboard";

export default function Dashboard() {

    const [stats, setStats] = useState({
        listings: 0,
        food_rescued: 0,
        expiring: 0,
        ngos: 0
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Dashboard API Error:", error);
        }
    };

    return (

        <BusinessLayout>

            {/* ============================= */}
            {/* DASHBOARD STAT CARDS */}
            {/* ============================= */}

            <div className="row g-4">

                <div className="col-md-6 col-lg-3">
                    <DashboardCard
                        title="Listings Active"
                        value={stats.listings}
                        subtitle="284 Restaurants"
                        color="#4F46E5"
                    />
                </div>

                <div className="col-md-6 col-lg-3">
                    <DashboardCard
                        title="Food Rescued"
                        value={`${stats.food_rescued} kg`}
                        subtitle="This Month"
                        color="#fd7e14"
                    />
                </div>

                <div className="col-md-6 col-lg-3">
                    <DashboardCard
                        title="CO₂ Prevented"
                        value="6420 kg"
                        subtitle="Estimated"
                        color="#0d6efd"
                    />
                </div>

                <div className="col-md-6 col-lg-3">
                    <DashboardCard
                        title="NGOs Active"
                        value={stats.ngos}
                        subtitle="Serving 8200 meals"
                        color="#6f42c1"
                    />
                </div>

            </div>


            {/* ============================= */}
            {/* FOOD CHART */}
            {/* ============================= */}

            <div className="row mt-4">

                <div className="col-12">

                    <div className="dashboard-section">

                        <FoodChart />

                    </div>

                </div>

            </div>




            {/* ============================= */}
            {/* RECENT INVENTORY */}
            {/* ============================= */}

            <div className="row mt-4">

                <div className="col-12">

                    <RecentTable />

                </div>

            </div>

        </BusinessLayout>

    );
}