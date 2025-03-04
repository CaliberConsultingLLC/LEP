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

  const summary = extractSection("Leadership Summary", "Your Leadership Strengths");
  const strengths = extractSection("Your Leadership Strengths", "Potential Blind Spots");
  const blindSpots = extractSection("Potential Blind Spots", "High-Impact Development Tip");
  const developmentTip = extractSection("High-Impact Development Tip");

  const renderCenteredSection = (title, content, isTraits = false) => (
    <div className="mb-4">
      <h4 className="fw-bold text-center" style={{ textDecoration: "underline", fontSize: "1.2rem" }}>{title}</h4>
      {isTraits ? (
        <div className="text-center">
          {content.map((line, index) => {
            const [trait, ...descriptionParts] = line.split(":");

            return (
              <div key={index} className="mb-3">
                <div style={{ fontStyle: "italic", fontSize: "1.2rem", textAlign: "center", margin: "10px 0" }}>
                  {trait.trim()}
                </div>
                <ul className="text-start mx-auto" style={{ maxWidth: "500px", paddingLeft: "20px" }}>
                  {descriptionParts.join(":").split("-").filter(Boolean).map((desc, idx) => (
                    <li key={idx} style={{ fontWeight: "normal", fontStyle: "normal" }}>
                      {desc.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center" style={{ fontSize: "1rem" }}>
          {content.map((line, index) => (
            <p key={index} style={{ marginBottom: "5px" }}>{line.replace(/^[-•]\s*/, "")}</p>
          ))}
        </div>
      )}
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

        {renderCenteredSection("Leadership Summary", summary)}
        {renderCenteredSection("Your Leadership Strengths", strengths, true)}
        {renderCenteredSection("Potential Blind Spots", blindSpots, true)}
        {renderCenteredSection("High-Impact Development Tip", developmentTip)}

        <div className="text-center">
          <button className="btn btn-primary" onClick={() => navigate("/")}>Start Over</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
