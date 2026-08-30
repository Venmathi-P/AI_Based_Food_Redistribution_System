import { useEffect, useState } from "react";
import NGOLayout from "../../layouts/NGOLayout";
import {
    getScheduledDonations,
    completePickup
} from "../../services/donationService";

function PickupSchedule() {

    const [pickups, setPickups] = useState([]);

    useEffect(() => {
        loadScheduledDonations();
    }, []);

    const loadScheduledDonations = async () => {
        try {
            const data = await getScheduledDonations();
            setPickups(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleComplete = async (id) => {

        try {

            await completePickup(id);

            alert("Pickup Completed Successfully");

            loadScheduledDonations();

        } catch (error) {

            console.error(error);

            alert("Unable to complete pickup");

        }

    };

    return (

        <NGOLayout>

            <div className="container-fluid fb-animate-in">

                <div className="fb-page-header">
                    <div>
                <h2 className="mb-0">
                    Pickup Schedule
                </h2>
                    </div>
                </div>

                <div className="card">

                    <div className="card-body">

                        <table className="table table-striped">

                            <thead>

                                <tr>

                                    <th>Business ID</th>

                                    <th>Food</th>

                                    <th>Pickup Date</th>

                                    <th>Pickup Time</th>

                                    <th>Status</th>

                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {pickups.length === 0 ? (

                                    <tr>

                                        <td colSpan="6" className="text-center">

                                            No Pickup Scheduled

                                        </td>

                                    </tr>

                                ) : (

                                    pickups.map((item) => (

                                        <tr key={item.id}>

                                            <td>{item.business_id}</td>

                                            <td>{item.product_name}</td>

                                            <td>{item.pickup_date}</td>

                                            <td>{item.pickup_time}</td>

                                            <td>

                                                <span className="badge bg-primary">

                                                    {item.status}

                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleComplete(item.id)}
                                                >
                                                    Complete
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

export default PickupSchedule;