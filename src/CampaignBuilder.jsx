import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CampaignBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Capture formData passed from ResultsPage (contains all user intake responses)
  const { formData } = location.state || {};

  const [userEmail, setUserEmail] = useState(""); // Email will be collected here
  const [campaignData, setCampaignData] = useState({}); // Trait/statement data

  useEffect(() => {
    if (!formData) {
      console.error("❌ Missing formData. Redirecting to intake.");
      navigate("/");  // If somehow accessed directly, redirect to intake.
      return;
    }

    // Example logic to generate the initial campaign traits
    const initialCampaign = {
      "Supportive": ["Be available for team check-ins", "Encourage open dialogue", "Provide regular positive feedback"],
      "Strategic": ["Align team efforts to big-picture goals", "Anticipate future challenges", "Focus on high-impact opportunities"],
      "Adaptive": ["Adjust strategies based on feedback", "Promote flexible problem-solving", "Encourage innovation"],
      "Empathetic": ["Actively listen to concerns", "Consider emotional impacts of decisions", "Show personal care for team members"],
      "Decisive": ["Make timely decisions", "Clarify decision rationale", "Own the outcomes confidently"]
    };

    // You could refine this to be AI-generated later using formData traits
    setCampaignData(initialCampaign);
  }, [formData, navigate]);

  return (
    <div className="container">
      <h2 className="text-center mt-4">Continuous Improvement Campaign</h2>

      {/* Email Input */}
      <div className="mb-3">
        <label className="form-label fw-bold">Your Email (for saving your campaign):</label>
        <input
          type="email"
          className="form-control"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
      </div>

      {/* Render Trait Sections */}
      {Object.entries(campaignData).map(([trait, statements]) => (
        <div key={trait} className="mb-4">
          <h4 className="fw-bold">{trait}</h4>
          {statements.map((statement, index) => (
            <textarea
              key={index}
              className="form-control mb-2"
              value={statement}
              onChange={(e) => {
                const updatedStatements = [...statements];
                updatedStatements[index] = e.target.value;

                setCampaignData((prev) => ({
                  ...prev,
                  [trait]: updatedStatements,
                }));
              }}
            />
          ))}
        </div>
      ))}

      {/* Save Button */}
      <div className="text-center mt-4">
        <button className="btn btn-primary">Save My Campaign</button>
      </div>
    </div>
  );
};

export default CampaignBuilder;
