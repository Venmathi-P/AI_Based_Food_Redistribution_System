import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NGOLayout from "../../layouts/NGOLayout";
import api from "../../services/api";

function Requirements() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        food_type: "",
        category: "",
        quantity_required: "",
        pickup_location: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !form.food_type ||
            !form.category ||
            !form.quantity_required ||
            !form.pickup_location
        ) {
            alert("Please fill all fields.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/ngo-requirements/",
                {
                    food_type: form.food_type,
                    category: form.category,
                    quantity_required: Number(
                        form.quantity_required
                    ),
                    pickup_location:
                        form.pickup_location
                }
            );

            console.log(
                "Requirement created:",
                response.data
            );

            alert(
                "NGO Requirement Created Successfully!"
            );

            // Go directly to AI Matching
            navigate("/ngo/matching");

        } catch (error) {

            console.error(
                "Requirement creation error:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to create NGO requirement."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <NGOLayout>

            <div className="container-fluid fb-animate-in">

                {/* PAGE HEADER */}

                <div className="fb-page-header">

                    <div>

                        <h2>
                            📋 NGO Food Requirements
                        </h2>

                        <p>
                            Tell us what food your organization
                            currently needs.
                        </p>

                    </div>

                </div>


                {/* REQUIREMENT FORM */}

                <div className="row">

                    <div className="col-lg-8">

                        <div className="card shadow-sm">

                            <div className="card-body p-4">

                                <h4 className="mb-1">
                                    Create Food Requirement
                                </h4>

                                <p className="text-muted mb-4">
                                    Enter your requirement so our
                                    AI matching engine can find
                                    suitable donations.
                                </p>


                                <form onSubmit={handleSubmit}>

                                    {/* FOOD TYPE */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Food Type
                                        </label>

                                        <input
                                            type="text"
                                            name="food_type"
                                            className="form-control"
                                            placeholder="Example: Mutton"
                                            value={
                                                form.food_type
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    {/* CATEGORY */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            className="form-select"
                                            value={
                                                form.category
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="">
                                                Select Category
                                            </option>

                                            <option value="Vegetarian">
                                                Vegetarian
                                            </option>

                                            <option value="Non-Vegetarian">
                                                Non-Vegetarian
                                            </option>

                                            <option value="Meat">
                                                Meat
                                            </option>

                                            <option value="Dairy">
                                                Dairy
                                            </option>

                                            <option value="Bakery">
                                                Bakery
                                            </option>

                                            <option value="Fruits">
                                                Fruits
                                            </option>

                                            <option value="Vegetables">
                                                Vegetables
                                            </option>

                                            <option value="Grains">
                                                Grains
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>

                                        </select>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Quantity Required
                                        </label>

                                        <input
                                            type="number"
                                            name="quantity_required"
                                            className="form-control"
                                            placeholder="Example: 8"
                                            min="1"
                                            value={
                                                form.quantity_required
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <small className="text-muted">
                                            Enter the required quantity
                                            in kg.
                                        </small>

                                    </div>


                                    {/* LOCATION */}

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Pickup Location
                                        </label>

                                        <input
                                            type="text"
                                            name="pickup_location"
                                            className="form-control"
                                            placeholder="Example: Chennai"
                                            value={
                                                form.pickup_location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    {/* BUTTON */}

                                    <button
                                        type="submit"
                                        className="btn btn-success w-100"
                                        disabled={loading}
                                    >

                                        {loading
                                            ? "Creating Requirement..."
                                            : "📋 Create Requirement"
                                        }

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>


                    {/* AI INFORMATION */}

                    <div className="col-lg-4">

                        <div className="card shadow-sm h-100">

                            <div className="card-body p-4">

                                <div
                                    style={{
                                        fontSize: "45px"
                                    }}
                                >
                                    🤖
                                </div>

                                <h4 className="mt-3">
                                    AI Matching
                                </h4>

                                <p className="text-muted">
                                    Once you create your requirement,
                                    the AI engine will compare it with
                                    available surplus food.
                                </p>

                                <hr />

                                <div className="mb-3">
                                    ✓ Food type compatibility
                                </div>

                                <div className="mb-3">
                                    ✓ Quantity availability
                                </div>

                                <div className="mb-3">
                                    ✓ Pickup location
                                </div>

                                <div>
                                    ✓ AI match score
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </NGOLayout>

    );

}

export default Requirements;