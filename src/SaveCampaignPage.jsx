import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SaveCampaignPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Expecting campaignData to be passed from CampaignBuilder
  const { campaignData } = location.state || {};

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState(""); 
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!userEmail.trim()) {
      alert("Please enter your email to save your campaign.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/save-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          userName,
          company,
          industry,
          jobTitle,
          campaignData
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save campaign (status ${response.status})`);
      }

      alert("✅ Your campaign has been saved!");
      navigate("/"); // Back to home or results page — adjust if needed

    } catch (error) {
      console.error("❌ Error saving campaign:", error);
      alert("There was an error saving your campaign. Please try again.");
    } finally {
      setSaving(false);
    }
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
        width: "100vw"
      }}
    >
      <div className="card shadow-lg p-5" style={{ maxWidth: "600px", width: "100%", overflowY: "auto", maxHeight: "90vh" }}>
        <div className="text-center mb-4">
          <img src="/circle logo test.jpg" alt="LEP Logo" style={{ width: "150px", marginBottom: "15px" }} />
          <h2 className="mb-3">Save Your Campaign</h2>
          <p>Enter your details below to save your personalized leadership campaign.</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Your Name (optional)</label>
          <input
            type="text"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Company</label>
          <input
            type="text"
            className="form-control"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your Company Name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Industry</label>
          <input
            type="text"
            className="form-control"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Industry (e.g., Tech, Healthcare)"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Job Title</label>
          <input
            type="text"
            className="form-control"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Your Job Title"
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Your Email (required)</label>
          <input
            type="email"
            className="form-control"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="text-center">
          <button className="btn btn-success" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save My Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveCampaignPage;
