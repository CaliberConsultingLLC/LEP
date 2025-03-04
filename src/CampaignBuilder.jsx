import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CampaignBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Capture formData from ResultsPage (ensure ResultsPage passes formData when navigating here)
  const { formData } = location.state || {};

  const [userEmail, setUserEmail] = useState("");
  const [campaignData, setCampaignData] = useState({});

  useEffect(() => {
    if (!formData) {
      console.error("❌ Missing formData. Redirecting to intake.");
      navigate("/");
      return;
    }

    // Placeholder for initial AI-generated content (can be replaced later)
    const initialCampaign = {
      "Supportive": [
        "Be available for team check-ins and emotional support.",
        "Encourage open dialogue and psychological safety.",
        "Provide regular recognition and celebrate wins."
      ],
      "Strategic": [
        "Align team efforts with overarching company goals.",
        "Anticipate future obstacles and proactively plan.",
        "Focus on high-impact initiatives and avoid busywork."
      ],
      "Adaptive": [
        "Adjust strategies based on real-time feedback.",
        "Promote flexible problem-solving approaches.",
        "Encourage experimentation and innovation."
      ],
      "Empathetic": [
        "Actively listen to team concerns without judgment.",
        "Consider emotional impacts when making decisions.",
        "Check in regularly on personal well-being."
      ],
      "Decisive": [
        "Make timely decisions when ambiguity arises.",
        "Communicate decisions and reasoning clearly.",
        "Own outcomes and adjust as needed."
      ]
    };

    setCampaignData(initialCampaign);
  }, [formData, navigate]);

  const handleStatementChange = (trait, index, newValue) => {
    setCampaignData((prev) => {
      const updatedStatements = [...prev[trait]];
      updatedStatements[index] = newValue;
      return { ...prev, [trait]: updatedStatements };
    });
  };

  const handleSaveCampaign = () => {
    console.log("Saving campaign for:", userEmail);
    console.log("Campaign Data:", campaignData);
    // Here you'd add your Firebase saving logic
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center vh-100 w-100"
      style={{
        backgroundImage: "url('/LEP Background 5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        overflowY: "auto"
      }}
    >
      <div className="card shadow-lg p-4" style={{ maxWidth: "800px", width: "100%", overflowY: "auto", maxHeight: "90vh" }}>
        <div className="text-center">
          <img src="/circle logo test.jpg" alt="LEP Logo" style={{ width: "120px", marginBottom: "15px" }} />
          <h2 className="fw-bold">Continuous Improvement Campaign</h2>
          <p className="text-muted">Refine your personalized leadership focus statements below.</p>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Your Email (for saving your campaign):</label>
          <input
            type="email"
            className="form-control"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {Object.entries(campaignData).map(([trait, statements]) => (
            <div key={trait} className="mb-4">
              <h4 className="fw-bold text-decoration-underline text-center">{trait}</h4>
              <div className="d-flex flex-column gap-2">
                {statements.map((statement, index) => (
                  <textarea
                    key={index}
                    className="form-control"
                    rows="2"
                    value={statement}
                    onChange={(e) => handleStatementChange(trait, index, e.target.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary w-50" onClick={handleSaveCampaign}>
            Save My Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;
