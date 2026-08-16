import React from "react";
import AIAnalysis from "../components/AIAnalysis";

const AITest = () => {
  return (
    <div className="container mt-5">
      <h2>FoodBridge AI Analysis</h2>

      <p className="text-muted">
        Test AI analysis for Inventory ID 65
      </p>

      <AIAnalysis inventoryId={65} />
    </div>
  );
};

export default AITest;