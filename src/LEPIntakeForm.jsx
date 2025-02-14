import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import SortableItem from "./components/SortableItem.jsx";

const sections = [
  {
    title: "Leadership Self-Perception",
    questions: [
      {
        id: "leadershipJourney",
        prompt: "How do you see yourself as a leader?",
        type: "radio",
        options: ["Emerging", "Learning", "Experienced", "Mastering"],
      },
      {
        id: "leadershipStyle",
        prompt: "What words describe your leadership style? (Select 3)",
        type: "multi-select",
        options: [
          "Assertive", "Supportive", "Strategic", "Adaptive", "Decisive",
          "Collaborative", "Visionary", "Empathetic", "Analytical",
          "Pragmatic", "Inspirational", "Resilient",
        ],
        limit: 3,
      },
      {
        id: "leadershipChallenge",
        prompt: "What’s your biggest leadership challenge today?",
        type: "radio",
        options: [
          "Engagement", "Decision-making", "Influence", "Conflict Resolution",
          "Time Management", "Delegation", "Emotional Intelligence",
          "Strategic Thinking", "Coaching & Mentoring",
        ],
      },
      {
        id: "teamDescription",
        prompt: "How would you describe your team currently?",
        type: "text",
      },
    ],
  },
  {
    title: "Leadership in Action",
    questions: [
      {
        id: "projectAction",
        prompt: "Your team is falling behind on a project. What’s your first action?",
        type: "radio",
        options: [
          "Set a strict deadline", "Offer additional support",
          "Re-evaluate priorities", "Consult the team for solutions",
        ],
      },
      {
        id: "feedbackResponse",
        prompt: "You receive critical feedback from a team member. How do you respond?",
        type: "text",
      },
      {
        id: "highPerformer",
        prompt: "A high performer has disengaged recently. What do you do?",
        type: "radio",
        options: [
          "Pull them aside to talk", "Give them a new challenge",
          "Analyze their recent performance", "Observe for a bit before acting",
        ],
      },
    ],
  },
  {
    title: "Team & Communication Dynamics",
    questions: [
      {
        id: "teamNeeds",
        prompt: "Rank the following in order of what your team needs most from you:",
        type: "ranking",
        options: [
          { id: "clarity", text: "Clarity" },
          { id: "support", text: "Support" },
          { id: "direction", text: "Direction" },
          { id: "flexibility", text: "Flexibility" },
          { id: "encouragement", text: "Encouragement" }
        ],
      },
      {
        id: "teamOpenness",
        prompt: "Do you feel your team is open with you?",
        type: "radio",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    title: "Leadership Growth & Reflection",
    questions: [
      {
        id: "admiredTrait",
        prompt: "What leadership trait do you most admire in others?",
        type: "radio",
        options: ["Confidence", "Empathy", "Resilience", "Vision", "Decisiveness"],
      },
      {
        id: "improvementGoal",
        prompt: "What’s one skill you want to improve this year?",
        type: "text",
      },
      {
        id: "confidenceRanking",
        prompt: "Rank the following leadership competencies in order of confidence:",
        type: "ranking",
        options: [
          { id: "decision-making", text: "Decision-making" },
          { id: "adaptability", text: "Adaptability" },
          { id: "conflict-resolution", text: "Conflict resolution" }
        ],
      },
    ],
  },
];

const LEPIntakeForm = () => {
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Fix: Initialize rankings in state
  const [teamNeeds, setTeamNeeds] = useState(sections[2].questions[0].options);
  const [confidenceRanking, setConfidenceRanking] = useState(sections[3].questions[2].options);

  // Fix: Ensure correct update of rankings
  const handleDragEnd = (event, id, setState) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setState((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setFormData((prev) => ({ ...prev, [id]: [...teamNeeds] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData);
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
      <h2 className="text-center mb-3">Leadership Intake</h2>
      <h4>{sections[currentSection].title}</h4>
      <form onSubmit={currentSection === sections.length - 1 ? handleSubmit : (e) => { e.preventDefault(); setCurrentSection(currentSection + 1); }}>
        {sections[currentSection].questions.map((q) => (
          <div className="mb-3" key={q.id}>
            <label className="form-label">{q.prompt}</label>

            {q.type === "ranking" ? (
              <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, q.id, q.id === "teamNeeds" ? setTeamNeeds : setConfidenceRanking)}>
                <SortableContext items={q.id === "teamNeeds" ? teamNeeds : confidenceRanking} strategy={verticalListSortingStrategy}>
                  {(q.id === "teamNeeds" ? teamNeeds : confidenceRanking).map((item) => (
                    <SortableItem key={item.id} id={item.id}>
                      {item.text}
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            ) : q.type === "radio" ? q.options.map((opt) => (
              <div key={opt}>
                <input type="radio" name={q.id} value={opt} onChange={() => handleChange(q.id, opt)} /> {opt}
              </div>
            )) : q.type === "multi-select" ? (
              <select multiple className="form-select" onChange={(e) => handleChange(q.id, Array.from(e.target.selectedOptions, option => option.value))}>
                {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : q.type === "text" && (
              <textarea className="form-control" onChange={(e) => handleChange(q.id, e.target.value)} />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary w-100">{currentSection === sections.length - 1 ? "Submit" : "Next Section"}</button>
      </form>
    </div>
  );
};

export default LEPIntakeForm;