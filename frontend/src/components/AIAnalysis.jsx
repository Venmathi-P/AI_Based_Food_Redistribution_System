import React, { useState } from "react";
import { analyzeInventoryWithAI } from "../services/aiService";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const AIAnalysis = ({ inventoryId }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
const handleAnalyze = async () => {

    if (!inventoryId) {
        setError("Invalid inventory ID.");
        return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {

        const data =
            await analyzeInventoryWithAI(inventoryId);

        setResult(data);

    } catch (err) {

        setError(
            err.message ||
            "AI analysis failed."
        );

    } finally {

        setLoading(false);

    }
};

  // -----------------------------------
  // AI Waste Risk Badge
  // -----------------------------------
  const getRiskClass = (riskLevel) => {
    switch (riskLevel) {
      case "CRITICAL":
        return "bg-danger";

      case "HIGH":
        return "bg-warning text-dark";

      case "MEDIUM":
        return "bg-info text-dark";

      case "LOW":
        return "bg-success";

      default:
        return "bg-secondary";
    }
  };

  // -----------------------------------
  // Expiry Risk
  // -----------------------------------
  const getExpiryRisk = (days) => {
    if (days <= 3) {
      return {
        level: "HIGH",
        className: "bg-danger",
      };
    }

    if (days <= 10) {
      return {
        level: "MEDIUM",
        className: "bg-warning text-dark",
      };
    }

    return {
      level: "LOW",
      className: "bg-success",
    };
  };

  // -----------------------------------
  // Expiry Risk Recommendation
  // -----------------------------------
  const getExpiryRecommendation = (days) => {
    if (days <= 0) {
      return "Expired - immediate action required.";
    }

    if (days <= 3) {
      return "Donate or redistribute immediately.";
    }

    if (days <= 10) {
      return "Plan donation within the next few days.";
    }

    return "Expiry is not currently a concern.";
  };

  return (
    <div className="mt-3">

      {/* Analyze Button */}
      <button
        className="btn btn-primary"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "🤖 Analyzing..." : "🤖 Analyze with AI"}
      </button>

      {/* Error */}
      {error && (
        <div className="alert alert-danger mt-3">
          <strong>AI Analysis Error:</strong>
          <br />
          {error}
        </div>
      )}

      {/* -------------------------------- */}
      {/* AI RESULT */}
      {/* -------------------------------- */}

      {result && (
        <div className="card mt-4 shadow">

          {/* Header */}
          <div className="card-header">
            <h4 className="mb-0">
              🤖 AI Analysis
            </h4>
          </div>

          <div className="card-body">

            {/* ================================= */}
            {/* PRODUCT INFORMATION */}
            {/* ================================= */}

            <h5 className="mb-3">
              📦 Product Information
            </h5>

            <div className="row mb-4">

              <div className="col-md-3 mb-3">
                <div className="card h-100 bg-light">
                  <div className="card-body">
                    <small className="text-muted">
                      Product
                    </small>

                    <h5 className="mt-2">
                      {result.product_name}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 bg-light">
                  <div className="card-body">
                    <small className="text-muted">
                      Barcode
                    </small>

                    <h5 className="mt-2">
                      {result.barcode || "N/A"}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 bg-light">
                  <div className="card-body">
                    <small className="text-muted">
                      Current Stock
                    </small>

                    <h5 className="mt-2">
                      {result.current_stock}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="card h-100 bg-light">
                  <div className="card-body">
                    <small className="text-muted">
                      Days to Expiry
                    </small>

                    <h5 className="mt-2">
                      {result.days_to_expiry}
                    </h5>
                  </div>
                </div>
              </div>

            </div>

            <hr />
            {/* 7-Day Demand Forecast Chart */}

{result.forecast?.daily_forecast?.length > 0 && (
  <div className="card mt-4 mb-4">
    <div className="card-body">

      <h6 className="mb-3">
        📈 7-Day Demand Forecast
      </h6>

      <div style={{ width: "100%", height: 300 }}>

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={result.forecast.daily_forecast}
            margin={{
              top: 10,
              right: 30,
              left: 10,
              bottom: 10,
            }}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
            />

            <YAxis
              allowDecimals={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="predicted_demand"
              name="Predicted Demand"
              stroke="#0d6efd"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  </div>
)}

            {/* ================================= */}
            {/* DEMAND FORECAST */}
            {/* ================================= */}

            <h5 className="mb-3">
              📈 Demand Forecast
            </h5>

            <div className="row mb-4">

              <div className="col-md-6 mb-3">

                <div className="card h-100 border-primary">

                  <div className="card-body">

                    <small className="text-muted">
                      7-Day Predicted Demand
                    </small>

                    <h2 className="mt-2">
                      {result.forecast?.total_predicted_demand ?? "N/A"}
                    </h2>

                    <small>
                      units expected in the next 7 days
                    </small>

                  </div>

                </div>

              </div>

              <div className="col-md-6 mb-3">

                <div className="card h-100 border-primary">

                  <div className="card-body">

                    <small className="text-muted">
                      Average Daily Demand
                    </small>

                    <h2 className="mt-2">
                      {result.forecast?.average_daily_demand ?? "N/A"}
                    </h2>

                    <small>
                      units expected per day
                    </small>

                  </div>

                </div>

              </div>

            </div>

            <hr />

            {/* ================================= */}
            {/* RISK ANALYSIS */}
            {/* ================================= */}

            <h5 className="mb-3">
              ⚠️ Risk Analysis
            </h5>

            <div className="row mb-4">

              {/* Expiry Risk */}

              <div className="col-md-6 mb-3">

                <div className="card h-100">

                  <div className="card-body">

                    <h6>
                      📅 Expiry Risk
                    </h6>

                    <p className="text-muted">
                      Based only on remaining shelf life.
                    </p>

                    {(() => {
                      const expiryRisk = getExpiryRisk(
                        result.days_to_expiry
                      );

                      return (
                        <>
                          <span
                            className={`badge ${expiryRisk.className} mb-3`}
                          >
                            {expiryRisk.level}
                          </span>

                          <p className="mb-0">
                            {getExpiryRecommendation(
                              result.days_to_expiry
                            )}
                          </p>
                        </>
                      );
                    })()}

                  </div>

                </div>

              </div>

              {/* AI Waste Risk */}

              <div className="col-md-6 mb-3">

                <div className="card h-100">

                  <div className="card-body">

                    <h6>
                      🤖 AI Waste Risk
                    </h6>

                    <p className="text-muted">
                      Based on expiry, stock, demand and surplus.
                    </p>

                    <span
                      className={`badge ${getRiskClass(
                        result.waste_risk?.risk_level
                      )} mb-3`}
                    >
                      {result.waste_risk?.risk_level || "N/A"}
                    </span>

                    <p className="mb-0">
                      AI Risk Score:{" "}
                      <strong>
                        {result.waste_risk?.waste_risk_score ?? "N/A"}
                      </strong>
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ================================= */}
            {/* WASTE DETAILS */}
            {/* ================================= */}

            <div className="row mb-4">

              <div className="col-md-4 mb-3">

                <div className="card bg-light h-100">

                  <div className="card-body">

                    <small className="text-muted">
                      Potential Surplus
                    </small>

                    <h2 className="mt-2">
                      {result.waste_risk?.potential_surplus ?? 0}
                    </h2>

                    <small>
                      units potentially at risk
                    </small>

                  </div>

                </div>

              </div>

              <div className="col-md-4 mb-3">

                <div className="card bg-light h-100">

                  <div className="card-body">

                    <small className="text-muted">
                      Stock Coverage
                    </small>

                    <h2 className="mt-2">
                      {result.waste_risk?.stock_coverage_days ?? "N/A"}
                    </h2>

                    <small>
                      days of estimated stock coverage
                    </small>

                  </div>

                </div>

              </div>

              <div className="col-md-4 mb-3">

                <div className="card bg-light h-100">

                  <div className="card-body">

                    <small className="text-muted">
                      Expected Demand
                    </small>

                    <h2 className="mt-2">
                      {result.waste_risk?.expected_demand_before_expiry ?? 0}
                    </h2>

                    <small>
                      expected before expiry
                    </small>

                  </div>

                </div>

              </div>

            </div>

            {/* ================================= */}
            {/* WASTE RECOMMENDATION */}
            {/* ================================= */}

            <div className="alert alert-warning">

              <h6>
                ⚠️ Waste Recommendation
              </h6>

              <p className="mb-0">
                {result.waste_risk?.recommendation ||
                  "No recommendation available."}
              </p>

            </div>

            <hr />

            {/* ================================= */}
            {/* REORDER RECOMMENDATION */}
            {/* ================================= */}

            <h5 className="mb-3">
              📦 Reorder Recommendation
            </h5>

            <div className="row mb-4">

              <div className="col-md-4 mb-3">

                <div className="card h-100 border-success">

                  <div className="card-body">

                    <small className="text-muted">
                      Recommended Order
                    </small>

                    <h2 className="mt-2">
                      {result.reorder?.recommended_order_quantity ?? 0}
                    </h2>

                    <small>
                      units
                    </small>

                  </div>

                </div>

              </div>

              <div className="col-md-4 mb-3">

                <div className="card h-100">

                  <div className="card-body">

                    <small className="text-muted">
                      Reorder Status
                    </small>

                    <div className="mt-3">

                      <span className="badge bg-secondary">
                        {result.reorder?.status || "N/A"}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              <div className="col-md-4 mb-3">

                <div className="card h-100">

                  <div className="card-body">

                    <small className="text-muted">
                      Storage Utilization
                    </small>

                    <h2 className="mt-2">
                      {result.reorder?.storage_utilization_percent ?? 0}%
                    </h2>

                  </div>

                </div>

              </div>

            </div>

            {/* ================================= */}
            {/* FINAL RECOMMENDATION */}
            {/* ================================= */}

            <div className="alert alert-primary">

              <h5>
                💡 Final AI Recommendation
              </h5>

              <p className="mb-0">
                {result.recommendation ||
                  "No recommendation available."}
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AIAnalysis;