import { useEffect, useState } from "react";
import NGOLayout from "../../layouts/NGOLayout";

import {
    getAcceptedDonations,
    schedulePickup
} from "../../services/donationService";


function AcceptedDonations() {

    const [donations, setDonations] = useState([]);

    // Store date/time separately for each donation
    const [pickupData, setPickupData] = useState({});

    const [schedulingId, setSchedulingId] = useState(null);


    // =====================================================
    // LOAD ACCEPTED DONATIONS
    // =====================================================

    useEffect(() => {

        loadAcceptedDonations();

    }, []);


    const loadAcceptedDonations = async () => {

        try {

            const ngoId =
                Number(
                    localStorage.getItem("user_id")
                );

            if (!ngoId) {

                alert(
                    "Please login again."
                );

                return;
            }


            const data =
                await getAcceptedDonations(
                    ngoId
                );

            setDonations(data);

        } catch (error) {

            console.error(
                "Failed to load accepted donations:",
                error
            );

        }

    };


    // =====================================================
    // DATE CHANGE
    // =====================================================

    const handleDateChange = (
        donationId,
        value
    ) => {

        setPickupData(
            previous => ({
                ...previous,

                [donationId]: {

                    ...previous[
                        donationId
                    ],

                    date: value

                }

            })
        );

    };


    // =====================================================
    // TIME CHANGE
    // =====================================================

    const handleTimeChange = (
        donationId,
        value
    ) => {

        setPickupData(
            previous => ({
                ...previous,

                [donationId]: {

                    ...previous[
                        donationId
                    ],

                    time: value

                }

            })
        );

    };


    // =====================================================
    // SCHEDULE PICKUP
    // =====================================================

    const handleSchedule = async (
        donationId
    ) => {

        const date =
            pickupData[
                donationId
            ]?.date;

        const time =
            pickupData[
                donationId
            ]?.time;


        // Validate date/time

        if (!date || !time) {

            alert(
                "Please select Pickup Date and Time"
            );

            return;

        }


        try {

            setSchedulingId(
                donationId
            );


            await schedulePickup(
                donationId,
                date,
                time
            );


            alert(
                "Pickup Scheduled Successfully"
            );


            // Clear only this donation's
            // selected date/time

            setPickupData(
                previous => {

                    const updated = {
                        ...previous
                    };

                    delete updated[
                        donationId
                    ];

                    return updated;

                }
            );


            // Reload accepted donations
            // Scheduled donation will disappear

            loadAcceptedDonations();


        } catch (error) {

            console.error(
                "Schedule pickup error:",
                error
            );


            alert(
                error.response?.data?.detail ||
                "Unable to Schedule Pickup"
            );

        } finally {

            setSchedulingId(
                null
            );

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
                        <h2>Accepted Donations</h2>
                        <p>Donations you've accepted, awaiting pickup scheduling.</p>
                    </div>
                </div>


                {/* ================================================= */}
                {/* TABLE CARD */}
                {/* ================================================= */}

                <div className="card">

                    <div className="card-body">

                        {donations.length === 0 ? (

                            <div className="text-center p-4">

                                <h5>
                                    No Accepted Donations
                                </h5>

                                <p className="text-muted mb-0">

                                    All accepted donations
                                    have been scheduled.

                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead>

                                        <tr>

                                            <th>
                                                Business
                                            </th>

                                            <th>
                                                Food
                                            </th>

                                            <th>
                                                Category
                                            </th>

                                            <th>
                                                Quantity
                                            </th>

                                            <th>
                                                Expiry
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Time
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {donations.map(
                                            (item) => (

                                                <tr
                                                    key={
                                                        item.id
                                                    }
                                                >

                                                    {/* BUSINESS */}

                                                    <td>

                                                        {
                                                            item.business_id
                                                        }

                                                    </td>


                                                    {/* FOOD */}

                                                    <td>

                                                        <strong>

                                                            {
                                                                item.product_name
                                                            }

                                                        </strong>

                                                    </td>


                                                    {/* CATEGORY */}

                                                    <td>

                                                        {
                                                            item.category
                                                        }

                                                    </td>


                                                    {/* QUANTITY */}

                                                    <td>

                                                        {
                                                            item.quantity
                                                        }

                                                    </td>


                                                    {/* EXPIRY */}

                                                    <td>

                                                        {
                                                            item.expiry_date
                                                        }

                                                    </td>


                                                    {/* PICKUP DATE */}

                                                    <td>

                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={
                                                                pickupData[
                                                                    item.id
                                                                ]?.date ||
                                                                ""
                                                            }
                                                            onChange={
                                                                (e) =>
                                                                    handleDateChange(
                                                                        item.id,
                                                                        e.target.value
                                                                    )
                                                            }
                                                            min={
                                                                new Date()
                                                                    .toISOString()
                                                                    .split(
                                                                        "T"
                                                                    )[0]
                                                            }
                                                        />

                                                    </td>


                                                    {/* PICKUP TIME */}

                                                    <td>

                                                        <input
                                                            type="time"
                                                            className="form-control"
                                                            value={
                                                                pickupData[
                                                                    item.id
                                                                ]?.time ||
                                                                ""
                                                            }
                                                            onChange={
                                                                (e) =>
                                                                    handleTimeChange(
                                                                        item.id,
                                                                        e.target.value
                                                                    )
                                                            }
                                                        />

                                                    </td>


                                                    {/* ACTION */}

                                                    <td>

                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() =>
                                                                handleSchedule(
                                                                    item.id
                                                                )
                                                            }
                                                            disabled={
                                                                schedulingId ===
                                                                item.id
                                                            }
                                                        >

                                                            {schedulingId ===
                                                            item.id

                                                                ? "⏳ Scheduling..."

                                                                : "📅 Schedule"

                                                            }

                                                        </button>

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

        </NGOLayout>

    );

}


export default AcceptedDonations;