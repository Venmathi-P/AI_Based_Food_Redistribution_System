import { useEffect, useState } from "react";
import NGOLayout from "../../layouts/NGOLayout";
import { getHistory } from "../../services/donationService";

function History() {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

        try {

            const data = await getHistory();

            setHistory(data);

        }

        catch(error){

            console.log(error);

        }

    };

    return (

        <NGOLayout>

            <div className="container-fluid">

                <h2 className="mb-4">

                    Donation History

                </h2>

                <table className="table table-striped">

                    <thead>

                        <tr>

                            <th>Business</th>

                            <th>Food</th>

                            <th>Quantity</th>

                            <th>Completed On</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            history.length === 0 ?

                            (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center"
                                    >

                                        No History

                                    </td>

                                </tr>

                            )

                            :

                            history.map(item => (

                                <tr key={item.id}>

                                    <td>{item.business_id}</td>

                                    <td>{item.product_name}</td>

                                    <td>{item.quantity}</td>

                                    <td>{item.pickup_date}</td>

                                    <td>

                                        <span className="badge bg-success">

                                            {item.status}

                                        </span>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </NGOLayout>

    );

}

export default History;