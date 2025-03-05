import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { analysis, campaign, formData } = location.state || {}; // ✅ Expect all three
  

  if (!analysis) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 w-100">
        <div className="text-center">
          <h2>No results found</h2>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Back to Intake</button>
        </div>
      </div>
    );
  }

  // Clean and split the analysis into usable lines
  const analysisLines = analysis.split("\n").map(line => line.trim()).filter(line => line);

  // Helper function to extract clean text block between headers
  const extractSection = (startKeyword, endKeyword = null) => {
    const startIndex = analysisLines.findIndex(line =>
      line.toLowerCase().includes(startKeyword.toLowerCase())
    );

    if (startIndex === -1) return "";

    const endIndex = endKeyword
      ? analysisLines.findIndex((line, idx) => idx > startIndex && line.toLowerCase().includes(endKeyword.toLowerCase()))
      : analysisLines.length;

    return analysisLines.slice(startIndex + 1, endIndex === -1 ? analysisLines.length : endIndex).join(" ");
  };

  const summary = extractSection("Leadership Summary", "Your Leadership Strengths");
  const strengths = extractSection("Your Leadership Strengths", "Potential Blind Spots");
  const blindSpots = extractSection("Potential Blind Spots", "High-Impact Development Tip");
  const developmentTip = extractSection("High-Impact Development Tip");

  const renderSection = (title, content) => (
    content ? (
      <div className="mb-4">
        <h4 className="fw-bold text-decoration-underline text-center">{title}</h4>
        <p className="text-center">{content}</p>
      </div>
    ) : null
  );

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
      <div className="card shadow-lg p-5" style={{ maxWidth: "700px", width: "100%", overflowY: "auto", maxHeight: "90vh" }}>
        <div className="text-center">
          <img src="/circle logo test.jpg" alt="LEP Logo" style={{ width: "150px", marginBottom: "15px" }} />
          <h2 className="mb-4">Your Leadership Analysis</h2>
        </div>

        {renderSection("Leadership Summary", summary)}
        {renderSection("Your Leadership Strengths", strengths)}
        {renderSection("Potential Blind Spots", blindSpots)}
        {renderSection("High-Impact Development Tip", developmentTip)}

        <div className="text-center mt-4">
    <button className="btn btn-success" onClick={() => navigate("/campaign-builder", { state: { campaign } })}>
        Build My Continuous Improvement Campaign
    </button>
</div>
      </div>
    </div>
  );
};

export default ResultsPage;