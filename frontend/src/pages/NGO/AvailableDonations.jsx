import { useEffect, useState } from "react";
import NGOLayout from "../../layouts/NGOLayout";

import {
  getPendingDonations,
  acceptDonation,
} from "../../services/donationService";


function AvailableDonations() {

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);


  // =====================================================
  // FETCH AVAILABLE DONATIONS
  // =====================================================

  useEffect(() => {
    fetchDonations();
  }, []);


  const fetchDonations = async () => {

    try {

      setLoading(true);

      const data = await getPendingDonations();

      setDonations(data);

    } catch (error) {

      console.error(
        "Error fetching donations:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FORMAT DATE TIME
  // =====================================================

  const formatDateTime = (value) => {

    if (!value) {
      return "Not specified";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  };


  // =====================================================
  // ACCEPT DONATION
  // =====================================================

  const handleAccept = async (id) => {

    try {

      setAcceptingId(id);

      /*
       * NGO ID is already obtained by the backend
       * from the logged-in JWT token.
       *
       * Therefore we only send donation ID.
       */

      await acceptDonation(id);

      alert(
        "Donation Accepted Successfully"
      );

      // Refresh available donations
      fetchDonations();

    } catch (err) {

      console.error(
        "Accept Donation Error:",
        err
      );

      alert(
        err.response?.data?.detail ||
        "Unable to accept donation"
      );

    } finally {

      setAcceptingId(null);

    }

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
              🍱 Available Donations
            </h2>

            <p>
              Browse surplus food listings from businesses
              and accept donations that match your requirements.
            </p>
          </div>

        </div>


        {/* ================================================= */}
        {/* DONATION CARDS */}
        {/* ================================================= */}

        {loading ? (

          <div className="text-center p-5">

            <div
              className="spinner-border text-primary"
              role="status"
            ></div>

            <p className="mt-3 text-muted">
              Loading available donations...
            </p>

          </div>

        ) : donations.length === 0 ? (

          <div className="alert alert-success">

            <h5>
              🎉 No Pending Donations
            </h5>

            <p className="mb-0">
              There are currently no surplus food
              donations available.
            </p>

          </div>

        ) : (

          <div className="row g-4">

            {donations.map((item) => (

              <div
                className="col-md-6 col-xl-4"
                key={item.id}
              >

                <div className="card shadow-sm h-100">

                  {/* ================================================= */}
                  {/* CARD HEADER */}
                  {/* ================================================= */}

                  <div className="card-header bg-white">

                    <div className="d-flex justify-content-between align-items-center">

                      <h5 className="mb-0">
                        🍱 {item.product_name}
                      </h5>

                      <span className="badge bg-warning text-dark">
                        {item.status}
                      </span>

                    </div>

                  </div>


                  {/* ================================================= */}
                  {/* CARD BODY */}
                  {/* ================================================= */}

                  <div className="card-body">

                    {/* Business */}

                    <div className="mb-3">

                      <small className="text-muted">
                        DONOR
                      </small>

                      <div className="fw-semibold">
                        Business {item.business_id}
                      </div>

                    </div>


                    {/* Category */}

                    <div className="mb-3">

                      <small className="text-muted">
                        CATEGORY
                      </small>

                      <div className="fw-semibold">
                        {item.category || "Not specified"}
                      </div>

                    </div>


                    {/* Quantity + Expiry */}

                    <div className="row mb-3">

                      <div className="col-6">

                        <small className="text-muted">
                          QUANTITY
                        </small>

                        <div className="fw-semibold">
                          ⚖️ {item.quantity} kg
                        </div>

                      </div>


                      <div className="col-6">

                        <small className="text-muted">
                          EXPIRY
                        </small>

                        <div className="fw-semibold">
                          📅 {item.expiry_date || "N/A"}
                        </div>

                      </div>

                    </div>


                    <hr />


                    {/* ================================================= */}
                    {/* PICKUP LOCATION */}
                    {/* ================================================= */}

                    <div className="mb-3">

                      <small className="text-muted">
                        📍 PICKUP LOCATION
                      </small>

                      <div className="fw-semibold">

                        {item.pickup_location ||
                          "Not specified"}

                      </div>

                    </div>


                    {/* ================================================= */}
                    {/* AVAILABILITY WINDOW */}
                    {/* ================================================= */}

                    <div className="mb-3">

                      <small className="text-muted">
                        🕐 AVAILABILITY WINDOW
                      </small>

                      <div className="small">

                        <div>

                          <strong>
                            From:
                          </strong>{" "}

                          {formatDateTime(
                            item.available_from
                          )}

                        </div>


                        <div className="mt-1">

                          <strong>
                            Until:
                          </strong>{" "}

                          {formatDateTime(
                            item.available_until
                          )}

                        </div>

                      </div>

                    </div>


                    {/* ================================================= */}
                    {/* ACCEPT BUTTON */}
                    {/* ================================================= */}

                    <button
                      className="btn btn-success w-100 mt-2"
                      onClick={() =>
                        handleAccept(item.id)
                      }
                      disabled={
                        item.status !== "Pending" ||
                        acceptingId === item.id
                      }
                    >

                      {acceptingId === item.id ? (

                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>

                          Accepting...

                        </>

                      ) : (

                        <>
                          ❤️ Accept Donation
                        </>

                      )}

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </NGOLayout>

  );

}

export default AvailableDonations;