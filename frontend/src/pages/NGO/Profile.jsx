import NGOLayout from "../../layouts/NGOLayout";

function Profile(){

    return(

        <NGOLayout>

            <div className="container-fluid">

                <h2 className="mb-4">

                    NGO Profile

                </h2>

                <div className="card shadow-sm">

                    <div className="card-body">

                        <p><strong>NGO Name:</strong> Helping Hands</p>

                        <p><strong>Email:</strong> ngo@foodbridge.com</p>

                        <p><strong>Phone:</strong> +91 9876543210</p>

                        <p><strong>Address:</strong> Chennai</p>

                    </div>

                </div>

            </div>

        </NGOLayout>

    );

}

export default Profile;