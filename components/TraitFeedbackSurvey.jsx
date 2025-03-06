import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TRAITS = [
    // Example — replace with actual traits and statements you generate
    {
        trait: "Supportive",
        statements: [
            "The leader provides clear and timely feedback.",
            "The leader supports my professional growth.",
            "The leader makes time to listen to my concerns."
        ]
    },
    {
        trait: "Decisive",
        statements: [
            "The leader makes decisions in a timely manner.",
            "The leader is clear when explaining decisions.",
            "The leader stays firm when a decision is made."
        ]
    }
];

// 4x4 grid values for X (Focus) and Y (Effectiveness)
const GRID_SIZE = 4;

const TraitFeedbackSurvey = () => {
    const [step, setStep] = useState("instructions");
    const [currentTraitIndex, setCurrentTraitIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const { campaign } = location.state || { campaign: TRAITS }; // Fallback for testing if no campaign passed

    const currentTrait = campaign[currentTraitIndex];

    const handleGridClick = (statementIndex, focus, effectiveness) => {
        setResponses(prev => ({
            ...prev,
            [currentTrait.trait]: {
                ...prev[currentTrait.trait],
                [statementIndex]: { focus, effectiveness }
            }
        }));
    };

    const handleNextTrait = () => {
        if (currentTraitIndex < campaign.length - 1) {
            setCurrentTraitIndex(currentTraitIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        const submittedData = [];

        Object.entries(responses).forEach(([trait, statementRatings]) => {
            Object.entries(statementRatings).forEach(([statementIndex, { focus, effectiveness }]) => {
                submittedData.push({
                    trait,
                    statement: campaign.find(t => t.trait === trait).statements[Number(statementIndex)],
                    focus,
                    effectiveness,
                    submittedAt: new Date().toISOString()
                });
            });
        });

        console.log("Submitting Anonymous Feedback:", submittedData);

        try {
            const response = await fetch("/api/save-anonymous-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submittedData)
            });

            if (response.ok) {
                alert("Thank you for your feedback!");
                navigate("/thank-you"); // Redirect to a thank-you page
            } else {
                throw new Error(`Failed to submit (status ${response.status})`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("There was an issue submitting your feedback. Please try again.");
        }
    };

    if (step === "instructions") {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 w-100" style={pageStyle}>
                <div className="card shadow-lg p-5" style={cardStyle}>
                    <h2 className="text-center">Team Feedback Instructions</h2>
                    <p>Welcome to the Leadership Evolution Project Team Feedback process. Your feedback is fully anonymous and helps your leader improve and grow.</p>
                    <p>You'll rate your leader's performance using a 4x4 grid for each statement. You'll assess:</p>
                    <ul>
                        <li><strong>Focus (X-Axis):</strong> How much effort you perceive your leader puts into this area.</li>
                        <li><strong>Effectiveness (Y-Axis):</strong> How effective they actually are at demonstrating this behavior.</li>
                    </ul>
                    <p>This dual rating system helps your leader understand not just where they succeed or struggle, but also whether their focus aligns with the team's perception.</p>
                    <button className="btn btn-primary w-100" onClick={() => setStep("survey")}>Start Feedback</button>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 w-100" style={pageStyle}>
            <div className="card shadow-lg p-5" style={{ ...cardStyle, maxWidth: "800px" }}>
                <h2 className="text-center mb-3">Feedback: {currentTrait.trait}</h2>
                {currentTrait.statements.map((statement, index) => (
                    <div key={index} className="mb-4">
                        <p className="fw-bold text-center">{statement}</p>
                        <Grid4x4
                            selectedCell={responses[currentTrait.trait]?.[index] || null}
                            onCellSelect={(focus, effectiveness) => handleGridClick(index, focus, effectiveness)}
                        />
                    </div>
                ))}
                <div className="text-center mt-3">
                    <button className="btn btn-primary" onClick={handleNextTrait}>
                        {currentTraitIndex < campaign.length - 1 ? "Next Trait" : "Submit Feedback"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Inline styles
const pageStyle = {
    backgroundImage: "url('/LEP Background 5.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    width: "100vw"
};

const cardStyle = {
    maxWidth: "600px",
    width: "100%",
    overflowY: "auto",
    maxHeight: "90vh"
};

// 4x4 Grid Component
const Grid4x4 = ({ selectedCell, onCellSelect }) => {
    const grid = Array.from({ length: GRID_SIZE }, (_, row) => (
        <div key={row} className="d-flex">
            {Array.from({ length: GRID_SIZE }, (_, col) => {
                const isSelected = selectedCell && selectedCell.focus === col + 1 && selectedCell.effectiveness === row + 1;
                return (
                    <div
                        key={`${row}-${col}`}
                        onClick={() => onCellSelect(col + 1, row + 1)}
                        style={{
                            width: "50px",
                            height: "50px",
                            border: "1px solid black",
                            backgroundColor: isSelected ? "#4caf50" : "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {isSelected ? "✔" : ""}
                    </div>
                );
            })}
        </div>
    ));

    return (
        <div className="d-flex flex-column align-items-center">
            <p><strong>Effectiveness (Y)</strong></p>
            <div>{grid}</div>
            <p className="mt-2"><strong>Focus (X)</strong></p>
        </div>
    );
};

export default TraitFeedbackSurvey;
