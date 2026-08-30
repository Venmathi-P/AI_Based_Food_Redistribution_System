import { useEffect, useState } from "react";

import NGOLayout from "../../layouts/NGOLayout";

import {
    getSustainabilityImpact
} from "../../services/analyticsService";


function Sustainability() {

    const [impact, setImpact] = useState(null);

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // LOAD IMPACT
    // =====================================================

    useEffect(() => {

        loadImpact();

    }, []);


    const loadImpact = async () => {

        try {

            setLoading(true);

            const data =
                await getSustainabilityImpact();

            console.log(
                "Sustainability Impact:",
                data
            );

            setImpact(data);

        } catch (error) {

            console.error(
                "Failed to load sustainability impact:",
                error
            );

            setImpact(null);

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <NGOLayout>

                <div className="container-fluid">

                    <h2 className="mb-4">
                        🌱 Sustainability Impact
                    </h2>

                    <div className="card shadow-sm">

                        <div className="card-body text-center py-5">

                            <div
                                className="spinner-border text-success mb-3"
                                role="status"
                            />

                            <h5>
                                Calculating sustainability impact...
                            </h5>

                        </div>

                    </div>

                </div>

            </NGOLayout>

        );

    }


    // =====================================================
    // ERROR / NO DATA
    // =====================================================

    if (!impact) {

        return (

            <NGOLayout>

                <div className="container-fluid">

                    <h2 className="mb-4">
                        🌱 Sustainability Impact
                    </h2>

                    <div className="alert alert-danger">

                        Unable to load sustainability
                        impact data.

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={loadImpact}
                    >
                        🔄 Try Again
                    </button>

                </div>

            </NGOLayout>

        );

    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <NGOLayout>

            <div className="container-fluid fb-animate-in">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="fb-page-header">

                    <div>

                        <h2>
                            🌱 Sustainability Impact
                        </h2>

                        <p>

                            Measure the environmental and
                            social impact of food redistribution.

                        </p>

                    </div>


                    <div className="fb-page-actions">
                        <button
                            className="btn btn-outline-success"
                            onClick={loadImpact}
                        >
                            🔄 Refresh
                        </button>
                    </div>

                </div>


                {/* ================================================= */}
                {/* IMPACT CARDS */}
                {/* ================================================= */}

                <div className="row g-4">


                    {/* FOOD WASTE */}

                    <div className="col-md-6 col-xl-3">

                        <div
                            className="card shadow-sm h-100"
                            style={{
                                borderLeft:
                                    "5px solid #198754"
                            }}
                        >

                            <div className="card-body">

                                <div
                                    className="text-muted mb-2"
                                >
                                    🍚 Food Waste Diverted
                                </div>

                                <h2 className="fw-bold">

                                    {
                                        impact.food_waste_diverted
                                    }

                                    <small className="fs-6 ms-1">
                                        kg
                                    </small>

                                </h2>

                                <small className="text-success">

                                    Food saved from waste

                                </small>

                            </div>

                        </div>

                    </div>


                    {/* MEALS */}

                    <div className="col-md-6 col-xl-3">

                        <div
                            className="card shadow-sm h-100"
                            style={{
                                borderLeft:
                                    "5px solid #0d6efd"
                            }}
                        >

                            <div className="card-body">

                                <div
                                    className="text-muted mb-2"
                                >
                                    🍽️ Meals Redistributed
                                </div>

                                <h2 className="fw-bold">

                                    {
                                        impact.meals_redistributed
                                    }

                                </h2>

                                <small className="text-primary">

                                    Estimated meals served

                                </small>

                            </div>

                        </div>

                    </div>


                    {/* CO2 */}

                    <div className="col-md-6 col-xl-3">

                        <div
                            className="card shadow-sm h-100"
                            style={{
                                borderLeft:
                                    "5px solid #20c997"
                            }}
                        >

                            <div className="card-body">

                                <div
                                    className="text-muted mb-2"
                                >
                                    🌍 CO₂ Emissions Saved
                                </div>

                                <h2 className="fw-bold">

                                    {
                                        impact.co2_saved
                                    }

                                    <small className="fs-6 ms-1">
                                        kg
                                    </small>

                                </h2>

                                <small className="text-success">

                                    Estimated CO₂e avoided

                                </small>

                            </div>

                        </div>

                    </div>


                    {/* COMPLETED */}

                    <div className="col-md-6 col-xl-3">

                        <div
                            className="card shadow-sm h-100"
                            style={{
                                borderLeft:
                                    "5px solid #6f42c1"
                            }}
                        >

                            <div className="card-body">

                                <div
                                    className="text-muted mb-2"
                                >
                                    🤝 Completed Donations
                                </div>

                                <h2 className="fw-bold">

                                    {
                                        impact.completed_donations
                                    }

                                </h2>

                                <small className="text-purple">

                                    Successfully redistributed

                                </small>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* IMPACT SUMMARY */}
                {/* ================================================= */}

                <div className="card shadow-sm mt-4">

                    <div className="card-body">

                        <h4 className="mb-3">

                            🌍 Your Contribution

                        </h4>

                        <div className="row">

                            <div className="col-md-4">

                                <div className="p-3 border rounded">

                                    <h5>
                                        🍚 Food Saved
                                    </h5>

                                    <p className="mb-0 text-muted">

                                        {
                                            impact.food_waste_diverted
                                        }
                                        kg of food was
                                        diverted from waste.

                                    </p>

                                </div>

                            </div>


                            <div className="col-md-4">

                                <div className="p-3 border rounded">

                                    <h5>
                                        🍽️ People Helped
                                    </h5>

                                    <p className="mb-0 text-muted">

                                        Approximately{" "}

                                        {
                                            impact.meals_redistributed
                                        }

                                        {" "}meals could be served.

                                    </p>

                                </div>

                            </div>


                            <div className="col-md-4">

                                <div className="p-3 border rounded">

                                    <h5>
                                        🌱 Environment
                                    </h5>

                                    <p className="mb-0 text-muted">

                                        Approximately{" "}

                                        {
                                            impact.co2_saved
                                        }

                                        {" "}kg CO₂e was avoided.

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* CALCULATION NOTE */}
                {/* ================================================= */}

                <div className="alert alert-light border mt-4">

                    <strong>
                        ℹ️ Impact Estimation
                    </strong>

                    <p className="mb-0 mt-1">

                        The dashboard estimates 4 meals per
                        kilogram of redistributed food and
                        1.6 kg CO₂e avoided per kilogram of
                        food waste diverted.

                    </p>

                </div>

            </div>

        </NGOLayout>

    );

}


export default Sustainability;