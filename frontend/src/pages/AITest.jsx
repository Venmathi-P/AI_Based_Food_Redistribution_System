import React from "react";
import AIAnalysis from "../components/AIAnalysis";

const AITest = () => {
  return (
    <div className="container py-5 fb-animate-in">
      <div className="fb-page-header">
        <div>
          <h2>🤖 FoodBridge AI Analysis</h2>
          <p>Test AI analysis for Inventory ID 65</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <AIAnalysis inventoryId={65} />
        </div>
      </div>
    </div>
  );
};

export default AITest;
