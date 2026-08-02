import { useEffect, useState } from "react";
import NGOLayout from "../../layouts/NGOLayout";
import {
  getPendingDonations,
  acceptDonation,
} from "../../services/donationService";

function AvailableDonations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getPendingDonations();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleAccept = async (id) => {
    try {
      const ngoId = Number(localStorage.getItem("user_id"));

      if (!ngoId) {
        alert("NGO ID not found. Please login again.");
        return;
      }

      await acceptDonation(id, ngoId);

      alert("Donation Accepted Successfully");

      // Refresh pending donations list
      fetchDonations();

    } catch (err) {
      console.error("Accept Donation Error:", err);
      alert("Unable to accept donation");
    }
  };

  return (
    <NGOLayout>
      <div className="container-fluid">

        <h2 className="mb-4">
          Available Donations
        </h2>

        <div className="card shadow-sm">

          <div className="card-body">

            <table className="table table-hover">

              <thead>
                <tr>
                  <th>Business ID</th>
                  <th>Food</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {donations.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="text-center">
                      No donations available.
                    </td>
                  </tr>

                ) : (

                  donations.map((item) => (

                    <tr key={item.id}>

                      <td>{item.business_id}</td>

                      <td>{item.product_name}</td>

                      <td>{item.quantity}</td>

                      <td>{item.expiry_date}</td>

                      <td>
                        <span className="badge bg-warning text-dark">
                          {item.status}
                        </span>
                      </td>

                      <td>

                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAccept(item.id)}
                          disabled={item.status !== "Pending"}
                        >
                          Accept
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </NGOLayout>
  );
}

export default AvailableDonations;