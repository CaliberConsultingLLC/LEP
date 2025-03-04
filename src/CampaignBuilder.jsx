import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "./firebase"; 
import { collection, addDoc } from "firebase/firestore";

const CampaignBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTraits, userEmail } = location.state || {};

  const [campaignData, setCampaignData] = useState({});

  // Default statement generator using AI-like placeholders (replace with API call if desired)
  const generateDefaultStatements = (trait) => [
    `Focus on applying ${trait} in high-stakes situations.`,
    `Ask your team how they experience your ${trait}.`,
    `Set one personal goal to deepen your ${trait} this month.`
  ];

  // Initialize editable statements when page loads
  useEffect(() => {
    if (selectedTraits) {
      const initialCampaign = {};
      selectedTraits.forEach((trait) => {
        initialCampaign[trait] = generateDefaultStatements(trait);
      });
      setCampaignData(initialCampaign);
    }
  }, [selectedTraits]);

  // Handle updating individual statements
  const handleStatementChange = (trait, index, newText) => {
    setCampaignData((prev) => ({
      ...prev,
      [trait]: prev[trait].map((stmt, i) => (i === index ? newText : stmt))
    }));
  };

  // Submit campaign to Firestore
  const handleSubmit = async () => {
    if (!userEmail) {
      alert("User email is missing. Cannot save.");
      return;
    }

    try {
      await addDoc(collection(db, "campaigns"), {
        userEmail,
        campaignData,
        timestamp: new Date(),
      });
      alert("Campaign saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error saving campaign:", error);
      alert("Failed to save the campaign.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 w-100" 
         style={{ backgroundImage: "url('/LEP Background 5.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", minHeight: "100vh" }}>
      <div className="card shadow-lg p-5 overflow-auto" style={{ maxWidth: "700px", width: "100%", maxHeight: "90vh" }}>
        <div className="text-center mb-4">
          <img src="/circle logo test.jpg" alt="LEP Logo" style={{ width: "150px", marginBottom: "15px" }} />
          <h2 className="mb-3">Continuous Improvement Campaign</h2>
          <p className="text-muted">Refine your personalized leadership focus statements below.</p>
        </div>

        {selectedTraits?.map((trait) => (
          <div key={trait} className="mb-4">
            <h4 className="fw-bold text-decoration-underline text-center">{trait}</h4>

            <div className="d-flex flex-column gap-3">
              {campaignData[trait]?.map((statement, index) => (
                <textarea
                  key={index}
                  className="form-control"
                  rows={3}
                  value={statement}
                  onChange={(e) => handleStatementChange(trait, index, e.target.value)}
                />
              ))}
            </div>
          </div>
        ))}

        <button className="btn btn-primary w-100 mt-3" onClick={handleSubmit}>Save My Campaign</button>
      </div>
    </div>
  );
};

export default CampaignBuilder;
