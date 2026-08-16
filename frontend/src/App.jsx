import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Inventory from "./pages/Inventory";

// Business
import BusinessDashboard from "./pages/Business/Dashboard";
import ExpiryAlerts from "./pages/Business/ExpiryAlerts";
// NGO
import NgoDashboard from "./pages/NGO/Dashboard";
import AvailableDonations from "./pages/NGO/AvailableDonations";
import AcceptedDonations from "./pages/NGO/AcceptedDonations";
import PickupSchedule from "./pages/NGO/PickupSchedule";
import History from "./pages/NGO/History";
import Profile from "./pages/NGO/Profile";
import Dashboard from "./pages/Dashboard";
import AITest from "./pages/AITest";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route path="/" element={<Login />} />

                <Route path="/register" element={<Register />} />

                {/* Business */}
{/* Business */}

<Route
    path="/business/dashboard"
    element={<BusinessDashboard />}
/>

<Route
    path="/inventory"
    element={<Inventory />}
/>

<Route
    path="/expiry-alerts"
    element={<ExpiryAlerts />}
/>

                {/* NGO */}

                <Route
                    path="/ngo/dashboard"
                    element={<NgoDashboard />}
                />

                <Route
                    path="/ngo/available-donations"
                    element={<AvailableDonations />}
                />

                <Route
                    path="/ngo/accepted-donations"
                    element={<AcceptedDonations />}
                />

                <Route
                    path="/ngo/pickup-schedule"
                    element={<PickupSchedule />}
                />

                <Route
                    path="/ngo/history"
                    element={<History />}
                />

                <Route
                    path="/ngo/profile"
                    element={<Profile />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-test" element={<AITest />} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;