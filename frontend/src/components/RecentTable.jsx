import { useState, useEffect } from "react";
import api from "../services/api";
export default function RecentTable() {

    
    const [recent, setRecent] = useState([]);

useEffect(() => {
    loadRecent();
}, []);

const loadRecent = async () => {
    try {
        const res = await api.get("/donations/recent");
        setRecent(res.data);
    } catch (err) {
        console.log(err);
    }
};

    return (

        <div className="card table-card mt-4">

            <div className="card-body">

                <h5>Recent Rescue Operations</h5>

                <table className="table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Donor</th>

                            <th>Food</th>

                            <th>Qty</th>

                            <th>NGO</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

{recent.length === 0 ? (

<tr>
    <td colSpan="6" className="text-center">
        No Recent Donations
    </td>
</tr>

) : (

recent.map(item => (

<tr key={item.id}>
    <td>{item.id}</td>
    <td>{item.business_name}</td>
    <td>{item.food_name}</td>
    <td>{item.quantity}</td>
    <td>{item.ngo_name}</td>
    <td>{item.status}</td>
</tr>

))

)}

</tbody>

                </table>

            </div>

        </div>

    );

}