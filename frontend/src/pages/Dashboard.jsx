import BusinessDashboard from "./Business/Dashboard";
import NgoDashboard from "./NGO/Dashboard";

function Dashboard() {

    const role = localStorage.getItem("role");

    if (role === "business") {
        return <BusinessDashboard />;
    }

    if (role === "ngo") {
        return <NgoDashboard />;
    }

    return <h2>Please login first.</h2>;
}

export default Dashboard;