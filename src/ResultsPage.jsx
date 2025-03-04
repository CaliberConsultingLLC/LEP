import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

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

  const analysisLines = analysis.split("\n").map(line => line.trim()).filter(line => line);

  const extractSection = (startKeyword, endKeyword = null) => {
    const startIndex = analysisLines.findIndex(line => 
      line.toLowerCase().includes(startKeyword.toLowerCase())
    );

    if (startIndex === -1) return [];

    const endIndex = endKeyword 
      ? analysisLines.findIndex((line, idx) => idx > startIndex && line.toLowerCase().includes(endKeyword.toLowerCase())) 
      : analysisLines.length;

    return analysisLines.slice(startIndex + 1, endIndex === -1 ? analysisLines.length : endIndex);
  };

  const summary = extractSection("Leadership Summary", "Leadership Traits");
  const strengths = extractSection("Leadership Traits", "Potential Blind Spots");
  const blindSpots = extractSection("Potential Blind Spots", "High-Impact Development Tip");
  const developmentTip = extractSection("High-Impact Development Tip");

  const parseTraitsAndDescriptions = (section) => {
    const traits = [];
    let currentTrait = null;
    section.forEach(line => {
      if (line.startsWith("-")) {
        if (currentTrait) {
          traits.push(currentTrait);
        }
        currentTrait = { trait: line.replace(/[-*]/g, "").trim(), descriptions: [] };
      } else if (currentTrait && line.trim()) {
        currentTrait.descriptions.push(line);
      }
    });
    if (currentTrait) traits.push(currentTrait);
    return traits;
  };

  const strengthTraits = parseTraitsAndDescriptions(strengths);
  const blindSpotTraits = parseTraitsAndDescriptions(blindSpots);

  const renderSectionHeader = (title) => (
    <h4 className="fw-bold text-center text-decoration-underline mt-4">{title}</h4>
  );

  const renderSummary = (summaryContent) => (
    <div className="mb-4 text-center">
      {summaryContent.map((line, index) => (
        <p key={index} className="mb-2">{line}</p>
      ))}
    </div>
  );

  const renderTraitsSection = (title, traits) => (
    <div className="mb-4">
      {renderSectionHeader(title)}
      {traits.map((trait, index) => (
        <div key={index} className="mb-3 text-center">
          <h5 className="fw-bold">{trait.trait}</h5>
          <div className="text-start">
            <ul className="list-unstyled">
              {trait.descriptions.map((desc, idx) => (
                <li key={idx} className="mb-1">{desc}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDevelopmentTip = (developmentContent) => (
    <div className="mb-4 text-center">
      {renderSectionHeader("High-Impact Development Tip")}
      {developmentContent.map((line, index) => (
        <p key={index} className="mb-2">{line}</p>
      ))}
    </div>
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

        {renderSectionHeader("Leadership Summary")}
        {renderSummary(summary)}

        {renderTraitsSection("Your Leadership Strengths", strengthTraits)}
        {renderTraitsSection("Potential Blind Spots", blindSpotTraits)}

        {renderDevelopmentTip(developmentTip)}

        <div className="text-center">
          <button className="btn btn-primary" onClick={() => navigate("/")}>Start Over</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
