import React from "react";
import { useLocation } from "react-router-dom"; // If you're using React Router

const ResultsPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const analysis = searchParams.get("analysis");

    const analysisLines = analysis ? analysis.split("\n") : [];

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
            <div className="card shadow-lg p-5" style={{ maxWidth: "600px", width: "100%" }}>
                <div className="text-center">
                    <img src="/circle logo test.jpg" alt="LEP Logo" style={{ width: "150px", marginBottom: "15px" }} />
                </div>
                <h4 className="fw-bold text-center">Your Leadership Insights</h4>
                <div className="mt-4">
                    {analysisLines.length > 0 ? (
                        <ul>
                            {analysisLines.map((line, index) => (
                                <li key={index}>{line}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No analysis available.</p>
                    )}
                </div>
                <div className="text-center mt-4">
                    <a href="/" className="btn btn-primary">Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
