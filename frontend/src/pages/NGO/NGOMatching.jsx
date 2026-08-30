import { useEffect, useState } from "react";
import NGOLayout from "../../layouts/NGOLayout";

import {
    getNGOMatches
} from "../../services/ngoMatchingService";

import {
    acceptDonation
} from "../../services/donationService";


function NGOMatching() {

    const [matches, setMatches] = useState([]);

    const [loading, setLoading] = useState(true);

    const [acceptingId, setAcceptingId] = useState(null);


    // =====================================================
    // LOAD AI MATCHES
    // =====================================================

    useEffect(() => {

        loadMatches();

    }, []);


    const loadMatches = async () => {

        try {

            setLoading(true);

            const data = await getNGOMatches();

            console.log(
                "AI NGO Matches:",
                data
            );

            setMatches(data);

        } catch (error) {

            console.error(
                "Failed to load AI matches:",
                error
            );

            setMatches([]);

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // MATCH SCORE COLOR
    // =====================================================

    const getScoreClass = (score) => {

        if (score >= 90)
            return "bg-success";

        if (score >= 70)
            return "bg-warning text-dark";

        if (score >= 50)
            return "bg-info text-dark";

        return "bg-secondary";

    };


    // =====================================================
    // MATCH LEVEL
    // =====================================================

    const getMatchIcon = (level) => {

        if (level === "Excellent")
            return "🟢";

        if (level === "Good")
            return "🟡";

        if (level === "Moderate")
            return "🟠";

        return "⚪";

    };


    // =====================================================
    // ACCEPT DONATION
    // =====================================================

    const handleAccept = async (donationId) => {

        try {

            setAcceptingId(donationId);

            await acceptDonation(
                donationId
            );

            alert(
                "Donation Accepted Successfully"
            );

            // Remove accepted donation
            setMatches(
                previous =>
                    previous.filter(
                        item =>
                            item.donation_id !==
                            donationId
                    )
            );

        } catch (error) {

            console.error(
                "Accept donation error:",
                error
            );

            alert(
                error.response?.data?.detail ||
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
                            🤖 AI NGO Matching
                        </h2>

                        <p>
                            Smart donation recommendations based
                            on your NGO requirements
                        </p>

                    </div>


                    <div className="fb-page-actions">
                        <button
                            className="btn btn-outline-primary"
                            onClick={loadMatches}
                        >
                            🔄 Refresh Matches
                        </button>
                    </div>

                </div>


                {/* ================================================= */}
                {/* INFO CARD */}
                {/* ================================================= */}

                <div className="alert alert-primary">

                    <strong>
                        🤖 AI Matching Engine
                    </strong>

                    <br />

                    <span>
                        Donations are ranked based on food type,
                        quantity and pickup location compatibility.
                    </span>

                </div>


                {/* ================================================= */}
                {/* LOADING */}
                {/* ================================================= */}

                {loading && (

                    <div className="card shadow-sm">

                        <div className="card-body text-center py-5">

                            <div
                                className="spinner-border text-primary mb-3"
                                role="status"
                            />

                            <h5>
                                Finding the best donations...
                            </h5>

                            <p className="text-muted mb-0">
                                AI is analyzing available surplus food.
                            </p>

                        </div>

                    </div>

                )}


                {/* ================================================= */}
                {/* NO MATCHES */}
                {/* ================================================= */}

                {!loading &&
                    matches.length === 0 && (

                        <div className="card shadow-sm">

                            <div className="card-body text-center py-5">

                                <div
                                    style={{
                                        fontSize: "50px"
                                    }}
                                >
                                    🔍
                                </div>

                                <h4 className="mt-3">
                                    No Matching Donations
                                </h4>

                                <p className="text-muted">
                                    No surplus food currently matches
                                    your NGO requirements.
                                </p>

                                <button
                                    className="btn btn-primary"
                                    onClick={loadMatches}
                                >
                                    🔄 Check Again
                                </button>

                            </div>

                        </div>

                    )}


                {/* ================================================= */}
                {/* MATCHES */}
                {/* ================================================= */}

                {!loading &&
                    matches.length > 0 && (

                        <div className="row g-4">

                            {matches.map(
                                (match) => (

                                    <div
                                        className="col-lg-6"
                                        key={`${match.donation_id}-${match.requirement_id}`}
                                    >

                                        <div className="card shadow-sm h-100">

                                            {/* CARD HEADER */}

                                            <div className="card-header d-flex justify-content-between align-items-center">

                                                <div>

                                                    <span
                                                        className="badge bg-primary me-2"
                                                    >
                                                        🤖 AI Match
                                                    </span>

                                                    <span
                                                        className="text-muted"
                                                    >
                                                        Donation #
                                                        {
                                                            match.donation_id
                                                        }
                                                    </span>

                                                </div>


                                                <span
                                                    className={`badge ${getScoreClass(
                                                        match.match_score
                                                    )}`}
                                                    style={{
                                                        fontSize: "14px"
                                                    }}
                                                >

                                                    {getMatchIcon(
                                                        match.match_level
                                                    )}

                                                    {" "}

                                                    {
                                                        match.match_score
                                                    }%

                                                    {" "}

                                                    {
                                                        match.match_level
                                                    }

                                                </span>

                                            </div>


                                            {/* CARD BODY */}

                                            <div className="card-body">

                                                <h4 className="mb-3">

                                                    🍚{" "}

                                                    {
                                                        match.product_name
                                                    }

                                                </h4>


                                                {/* DETAILS */}

                                                <div className="row g-3 mb-3">

                                                    <div className="col-md-6">

                                                        <div className="border rounded p-3">

                                                            <small className="text-muted">
                                                                Category
                                                            </small>

                                                            <div className="fw-semibold">
                                                                {
                                                                    match.category
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div className="col-md-6">

                                                        <div className="border rounded p-3">

                                                            <small className="text-muted">
                                                                Available Quantity
                                                            </small>

                                                            <div className="fw-semibold">
                                                                {
                                                                    match.quantity
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div className="col-md-6">

                                                        <div className="border rounded p-3">

                                                            <small className="text-muted">
                                                                Expiry Date
                                                            </small>

                                                            <div className="fw-semibold">
                                                                {
                                                                    match.expiry_date
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div className="col-md-6">

                                                        <div className="border rounded p-3">

                                                            <small className="text-muted">
                                                                Pickup Location
                                                            </small>

                                                            <div className="fw-semibold">
                                                                📍{" "}
                                                                {
                                                                    match.pickup_location
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* ================================================= */}
                                                {/* NGO REQUIREMENT */}
                                                {/* ================================================= */}

                                                <div className="alert alert-light border">

                                                    <h6 className="fw-bold">

                                                        🎯 Your Requirement

                                                    </h6>

                                                    <div>

                                                        Food:
                                                        {" "}
                                                        <strong>
                                                            {
                                                                match.required_food
                                                            }
                                                        </strong>

                                                    </div>

                                                    <div>

                                                        Quantity Required:
                                                        {" "}
                                                        <strong>
                                                            {
                                                                match.required_quantity
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* ================================================= */}
                                                {/* AI REASONS */}
                                                {/* ================================================= */}

                                                <div>

                                                    <h6 className="fw-bold">

                                                        🤖 Why AI Recommended This

                                                    </h6>


                                                    <ul className="list-group mb-3">

                                                        {match.reasons?.map(
                                                            (
                                                                reason,
                                                                index
                                                            ) => (

                                                                <li
                                                                    key={index}
                                                                    className="list-group-item"
                                                                >

                                                                    <span className="text-success me-2">
                                                                        ✓
                                                                    </span>

                                                                    {
                                                                        reason
                                                                    }

                                                                </li>

                                                            )
                                                        )}

                                                    </ul>

                                                </div>


                                                {/* ================================================= */}
                                                {/* ACTION */}
                                                {/* ================================================= */}

                                                <button
                                                    className="btn btn-success w-100"
                                                    onClick={() =>
                                                        handleAccept(
                                                            match.donation_id
                                                        )
                                                    }
                                                    disabled={
                                                        acceptingId ===
                                                        match.donation_id
                                                    }
                                                >

                                                    {acceptingId ===
                                                    match.donation_id

                                                        ? "⏳ Accepting..."

                                                        : "🤝 Accept Donation"
                                                    }

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </div>

        </NGOLayout>

    );

}


export default NGOMatching;