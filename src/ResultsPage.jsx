import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CampaignBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userEmail = location.state?.userEmail || "";
  
  // This should be populated either from AI response or defaults
  const [campaign, setCampaign] = useState([
    { trait: "Supportive", statements: ["Placeholder statement 1", "Placeholder statement 2", "Placeholder statement 3"] },
    { trait: "Strategic", statements: ["Placeholder statement 1", "Placeholder statement 2", "Placeholder statement 3"] }
  ]);

  // Simulate AI generation (can be replaced with a real API call later)
  useEffect(() => {
    const fetchInitialCampaign = async () => {
      // Placeholder logic - in reality, you'd call an endpoint or get it from analysis
      const aiGeneratedCampaign = [
        { trait: "Supportive", statements: ["I ensure my team feels heard.", "I offer guidance when challenges arise.", "I celebrate team wins consistently."] },
        { trait: "Strategic", statements: ["I align team goals with big-picture vision.", "I prioritize projects based on strategic impact.", "I communicate how daily work fits into larger goals."] }
      ];
      setCampaign(aiGeneratedCampaign);
    };

    fetchInitialCampaign();
  }, []);

  const handleStatementChange = (traitIndex, statementIndex, newValue) => {
    const updatedCampaign = [...campaign];
    updatedCampaign[traitIndex].statements[statementIndex] = newValue;
    setCampaign(updatedCampaign);
  };

  const handleSaveCampaign = async () => {
    const payload = {
      userEmail,
      campaign
    };

    console.log("Saving Campaign:", payload);

    try {
      const response = await fetch("/api/save-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to save campaign. Status: ${response.status}`);
      }

      alert("Campaign saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error saving campaign:", error);
      alert("Failed to save campaign. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 w-100" style={{
      backgroundImage: "url('/LEP Background 5.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
      width: "100vw"
    }}>
      <div className="card shadow-lg p-5" style={{ maxWidth: "700px", width: "100%", overflowY: "auto", maxHeight: "90vh" }}>
        <div className="text-center">
          <img src="/circle logo test.jpg" alt="LEP Logo" style={{ width: "150px", marginBottom: "15px" }} />
          <h2 className="mb-3">Continuous Improvement Campaign</h2>
          <p>Refine your personalized leadership focus statements below.</p>
        </div>

        {campaign.map((traitData, traitIndex) => (
          <div key={traitData.trait} className="mb-4">
            <h4 className="fw-bold text-center">{traitData.trait}</h4>
            {traitData.statements.map((statement, statementIndex) => (
              <div key={statementIndex} className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={statement}
                  onChange={(e) => handleStatementChange(traitIndex, statementIndex, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}

        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={handleSaveCampaign}>Save My Campaign</button>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;
