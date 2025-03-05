import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CampaignBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { campaign } = location.state || {};

  const [campaignData, setCampaignData] = useState(() => {
    const initialData = {};
    if (campaign) {
      campaign.forEach(trait => {
        initialData[trait.trait] = [...trait.statements]; // Pre-fill with AI-generated statements
      });
    }
    return initialData;
  });

  const handleStatementChange = (trait, index, value) => {
    setCampaignData(prev => {
      const updatedStatements = [...prev[trait]];
      updatedStatements[index] = value;
      return { ...prev, [trait]: updatedStatements };
    });
  };

  const handleProceedToSave = () => {
    // ✅ Navigate to the SaveCampaignPage and pass campaignData for final save step
    navigate("/save-campaign", { state: { campaignData } });
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
        <div className="text-center mb-4">
          <img src="/circle logo test.jpg" alt="LEP Logo" style={{ width: "150px", marginBottom: "15px" }} />
          <h2 className="mb-3">Continuous Improvement Campaign</h2>
          <p>Review and customize your personalized leadership focus statements.</p>
        </div>

        {campaign && campaign.map(({ trait }, traitIndex) => (
          <div key={traitIndex} className="mb-4">
            <h4 className="fw-bold text-decoration-underline text-center">{trait}</h4>
            {campaignData[trait]?.map((statement, index) => (
              <div key={index} className="mb-2">
                <textarea
                  className="form-control"
                  value={statement}
                  onChange={(e) => handleStatementChange(trait, index, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}

<div className="text-center">
    <button className="btn btn-primary" onClick={handleProceedToSave}>
        Proceed to Save Campaign
    </button>
</div>
      </div>
    </div>
  );
};

export default CampaignBuilder;
