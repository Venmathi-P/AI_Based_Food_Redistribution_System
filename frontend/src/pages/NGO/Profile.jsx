import NGOLayout from "../../layouts/NGOLayout";

function Profile() {

    const ngoName = localStorage.getItem("business_name");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");
    const email = localStorage.getItem("email");

    return (

        <NGOLayout>

            <div className="container-fluid">

                <h2 className="mb-4">
                    🏥 NGO Profile
                </h2>

                <div className="card shadow border-0">

                    <div className="card-header bg-success text-white">

                        <h4 className="mb-0">
                            Profile Information
                        </h4>

                    </div>

                    <div className="card-body">

                        <div className="text-center mb-4">

                            <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt="NGO"
                                width="120"
                                height="120"
                            />

                            <h3 className="mt-3">
                                {ngoName}
                            </h3>

                            <span className="badge bg-success">
                                {role?.toUpperCase()}
                            </span>

                        </div>

                        <table className="table table-bordered">

                            <tbody>

                                <tr>
                                    <th width="30%">NGO ID</th>
                                    <td>{userId}</td>
                                </tr>

                                <tr>
                                    <th>NGO Name</th>
                                    <td>{ngoName}</td>
                                </tr>

                                <tr>
                                    <th>Email</th>
                                    <td>{email || "Not Available"}</td>
                                </tr>

                                <tr>
                                    <th>Phone</th>
                                    <td>+91 9876543210</td>
                                </tr>

                                <tr>
                                    <th>Address</th>
                                    <td>Chennai, Tamil Nadu</td>
                                </tr>

                                <tr>
                                    <th>Role</th>
                                    <td>{role}</td>
                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </NGOLayout>

    );

}

export default Profile;