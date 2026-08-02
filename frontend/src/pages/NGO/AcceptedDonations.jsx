import { useEffect, useState } from "react";
import NGOLayout from "../../layouts/NGOLayout";
import {
    getAcceptedDonations,
    schedulePickup
} from "../../services/donationService";

function AcceptedDonations() {

    const [donations, setDonations] = useState([]);

    const [pickupDate, setPickupDate] = useState("");

    const [pickupTime, setPickupTime] = useState("");

    useEffect(() => {
        loadAcceptedDonations();
    }, []);

    const loadAcceptedDonations = async () => {

        try {

            const ngoId = Number(localStorage.getItem("user_id"));

            if (!ngoId) {
                alert("Please login again.");
                return;
            }

            const data = await getAcceptedDonations(ngoId);

            setDonations(data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleSchedule = async (donationId) => {

        if (!pickupDate || !pickupTime) {

            alert("Please select Pickup Date and Time");

            return;

        }

        try {

            await schedulePickup(
                donationId,
                pickupDate,
                pickupTime
            );

            alert("Pickup Scheduled Successfully");

            setPickupDate("");

            setPickupTime("");

            loadAcceptedDonations();

        } catch (error) {

            console.log(error);

            alert("Unable to Schedule Pickup");

        }

    };

    return (

        <NGOLayout>

            <div className="container-fluid">

                <h2 className="mb-4">

                    Accepted Donations

                </h2>

                <div className="card shadow-sm">

                    <div className="card-body">

                        {donations.length === 0 ? (

                            <div className="text-center p-4">

                                <h5>No Accepted Donations</h5>

                            </div>

                        ) : (

                            <table className="table table-hover">

                                <thead>

                                    <tr>

                                        <th>Business</th>

                                        <th>Food</th>

                                        <th>Category</th>

                                        <th>Quantity</th>

                                        <th>Expiry</th>

                                        <th>Date</th>

                                        <th>Time</th>

                                        <th>Action</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {donations.map((item) => (

                                        <tr key={item.id}>

                                            <td>{item.business_id}</td>

                                            <td>{item.product_name}</td>

                                            <td>{item.category}</td>

                                            <td>{item.quantity}</td>

                                            <td>{item.expiry_date}</td>

                                            <td>

                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={pickupDate}
                                                    onChange={(e) =>
                                                        setPickupDate(e.target.value)
                                                    }
                                                />

                                            </td>

                                            <td>

                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={pickupTime}
                                                    onChange={(e) =>
                                                        setPickupTime(e.target.value)
                                                    }
                                                />

                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() =>
                                                        handleSchedule(item.id)
                                                    }
                                                >

                                                    Schedule

                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        )}

                    </div>

                </div>

            </div>

        </NGOLayout>

    );

}

export default AcceptedDonations;