import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

  if (!analysisResult) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 w-100">
        <div className="text-center">
          <h2>No results found</h2>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Back to Intake</button>
        </div>
      </div>
    );
  }

  // Split the AI result into lines
  const analysisLines = analysisResult.split("\n").map(line => line.trim()).filter(line => line);

  // Helper to split the analysis into sections
  const getSectionContent = (startKeyword, endKeyword) => {
    const startIndex = analysisLines.findIndex(line => line.toLowerCase().includes(startKeyword.toLowerCase()));
    const endIndex = endKeyword
      ? analysisLines.findIndex((line, idx) => idx > startIndex && line.toLowerCase().includes(endKeyword.toLowerCase()))
      : analysisLines.length;

    if (startIndex === -1) return [];

    return analysisLines.slice(startIndex + 1, endIndex === -1 ? analysisLines.length : endIndex);
  };

  const summary = getSectionContent("Characterize", "Blind Spots");
  const blindSpots = getSectionContent("Blind Spots", "Development Tip");
  const developmentTip = getSectionContent("Development Tip");

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

        {/* Leadership Summary */}
        <div className="mb-4">
          <h4 className="fw-bold">Leadership Summary</h4>
          <ul>
            {summary.map((line, index) => (
              <li key={`summary-${index}`}>{line}</li>
            ))}
          </ul>
        </div>

        {/* Blind Spots */}
        <div className="mb-4">
          <h4 className="fw-bold">Potential Blind Spots</h4>
          <ul>
            {blindSpots.map((line, index) => (
              <li key={`blindspot-${index}`}>{line}</li>
            ))}
          </ul>
        </div>

        {/* Development Tip */}
        <div className="mb-4">
          <h4 className="fw-bold">High-Impact Development Tip</h4>
          <ul>
            {developmentTip.map((line, index) => (
              <li key={`tip-${index}`}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <button className="btn btn-primary" onClick={() => navigate("/")}>Start Over</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;