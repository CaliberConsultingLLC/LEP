import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const LEPIntakeForm = () => {
  const [formData, setFormData] = useState({
    leadershipJourney: "",
    leadershipConfidence: 4,
    teamEngagement: "",
    teamEngagementReason: "",
    leadershipChallenges: "",
    teamDynamic: "",
    feedbackPreference: "",
    leadershipPriorities: [],
    adjustStyleFrequency: 3,
    situationalChoice: "",
    disengagedTeamMember: "",
    leadershipCommitment: 4,
    leadershipReflection: "",
    aiRoadmapOptIn: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (e) => {
    const options = [...e.target.options].filter(o => o.selected).map(o => o.value);
    setFormData((prev) => ({ ...prev, leadershipPriorities: options }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Submitting form:", formData); // Debugging log
  
    try {
      const response = await fetch("/api/analyze-leadership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      console.log("AI Analysis Result:", result);
      alert("Analysis Complete! Check console for results.");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an issue submitting the form.");
    }
  };
  return (
    <div className="container mt-5 p-4 bg-light shadow rounded">
      <h2 className="text-center mb-3">Leadership Intake Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Leadership Snapshot */}
        <div className="mb-3">
          <label className="form-label">Which of these best describes your leadership journey?</label>
          <select className="form-select" name="leadershipJourney" onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="new">I’m new to leadership (0-1 year)</option>
            <option value="learning">I’ve been leading for a while but still learning (1-3 years)</option>
            <option value="experienced">I consider myself experienced (3+ years)</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Rank the following leadership priorities in order of importance (Select multiple):</label>
          <select className="form-select" multiple name="leadershipPriorities" onChange={handlePriorityChange}>
            <option value="performance">Team Performance</option>
            <option value="engagement">Employee Engagement & Morale</option>
            <option value="decision">Decision-Making & Strategic Thinking</option>
            <option value="communication">Communication & Influence</option>
            <option value="growth">Personal Growth & Leadership Skills</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">How confident are you in your leadership abilities? (1-7)</label>
          <input type="range" className="form-range" name="leadershipConfidence" min="1" max="7" value={formData.leadershipConfidence} onChange={handleChange} />
        </div>

        {/* Team & Workplace Dynamics */}
        <div className="mb-3">
          <label className="form-label">Do you feel like your team openly shares their thoughts and ideas with you?</label>
          <select className="form-select" name="teamEngagement" onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {formData.teamEngagement === "no" && (
          <div className="mb-3">
            <label className="form-label">What do you think prevents them from doing so?</label>
            <textarea className="form-control" name="teamEngagementReason" onChange={handleChange}></textarea>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Imagine you’re leading a meeting. You ask your team for input, and they stay silent. What’s your gut reaction?</label>
          <select className="form-select" name="situationalChoice" onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="agree">Maybe they just agree with me.</option>
            <option value="frustrated">This is frustrating—why won’t they engage?</option>
            <option value="nothing">They must not have anything to add.</option>
            <option value="dominating">I might be dominating the conversation too much.</option>
            <option value="other">Other (please explain)</option>
          </select>
        </div>

        {/* Situational Insights */}
        <div className="mb-3">
          <label className="form-label">Which statement feels more like you?</label>
          <select className="form-select" name="situationalChoice" onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="fast">I focus on getting things done quickly, even if it means less discussion.</option>
            <option value="inclusive">I focus on making sure everyone has input, even if it takes longer to reach a decision.</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">You notice a high-performing team member has become disengaged. What’s your first step?</label>
          <select className="form-select" name="disengagedTeamMember" onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="ask">Pull them aside and ask directly what’s wrong</option>
            <option value="data">Look at their recent performance data before taking action</option>
            <option value="reflect">Reflect on whether my leadership style may have contributed</option>
            <option value="project">Give them a stretch project to reignite engagement</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  );
};

export default LEPIntakeForm;
