import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";  // Ensure firebase.js is set up correctly
import { collection, addDoc } from "firebase/firestore";

const initialTraits = [
  { name: "Adaptability", statements: ["", "", ""] },
  { name: "Empathy", statements: ["", "", ""] },
  { name: "Decisiveness", statements: ["", "", ""] },
  { name: "Visionary Thinking", statements: ["", "", ""] },
  { name: "Collaboration", statements: ["", "", ""] }
];

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const [traits, setTraits] = useState(initialTraits);
  const [email, setEmail] = useState("");

  const handleStatementChange = (traitIndex, statementIndex, value) => {
    const updatedTraits = [...traits];
    updatedTraits[traitIndex].statements[statementIndex] = value;
    setTraits(updatedTraits);
  };

  const handleSubmit = async () => {
    if (!email) {
      alert("Please provide your email address.");
      return;
    }

    const campaignData = {
      email,
      traits,
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "continuous_campaigns"), campaignData);
      alert("Campaign saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error saving campaign:", error);
      alert("Failed to save campaign.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Build Your Continuous Improvement Campaign</h2>
      <div className="mb-3">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {traits.map((trait, traitIndex) => (
        <div key={trait.name} className="mb-4">
          <h4 className="fw-bold">{trait.name}</h4>
          {[...Array(3)].map((_, statementIndex) => (
            <div key={statementIndex} className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder={`Statement ${statementIndex + 1}`}
                value={trait.statements[statementIndex]}
                onChange={(e) => handleStatementChange(traitIndex, statementIndex, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleSubmit}>Submit Campaign</button>
      </div>
    </div>
  );
};

export default CampaignBuilder;
