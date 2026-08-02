import NGOLayout from "../../layouts/NGOLayout";
import DashboardCard from "../../components/DashboardCard";

function Dashboard() {
    return (
        <NGOLayout>
            <div className="container-fluid">

                <h2 className="mb-4">
                    NGO Dashboard
                </h2>

                <div className="row g-4">

                    <div className="col-md-3">
                        <DashboardCard
                            title="Available Donations"
                            value="125"
                            subtitle="Ready to Claim"
                            color="#4F46E5"
                        />
                    </div>

                    <div className="col-md-3">
                        <DashboardCard
                            title="Accepted"
                            value="42"
                            subtitle="This Month"
                            color="#0d6efd"
                        />
                    </div>

                    <div className="col-md-3">
                        <DashboardCard
                            title="Scheduled Pickups"
                            value="18"
                            subtitle="Upcoming"
                            color="#fd7e14"
                        />
                    </div>

                    <div className="col-md-3">
                        <DashboardCard
                            title="Meals Served"
                            value="8,420"
                            subtitle="Estimated"
                            color="#6f42c1"
                        />
                    </div>

                </div>

                <div className="card mt-4 shadow-sm">
                    <div className="card-body">
                        <h4>Recent Donations</h4>

                        <table className="table table-striped mt-3">
                            <thead>
                                <tr>
                                    <th>Donor</th>
                                    <th>Food</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>Fresh Mart</td>
                                    <td>Vegetables</td>
                                    <td>60 kg</td>
                                    <td>Available</td>
                                </tr>

                                <tr>
                                    <td>Hotel Sunshine</td>
                                    <td>Rice Meals</td>
                                    <td>45 kg</td>
                                    <td>Accepted</td>
                                </tr>

                                <tr>
                                    <td>Campus Canteen</td>
                                    <td>Bread</td>
                                    <td>30 kg</td>
                                    <td>Scheduled</td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>

            </div>
        </NGOLayout>
    );
}

export default Dashboard;