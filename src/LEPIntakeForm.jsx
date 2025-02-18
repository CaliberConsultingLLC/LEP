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
        id: "teamSize",
        prompt: "On a scale from 1 to 10, how stressful do you find leadership?",
        type: "slider",
        min: 3,
        max: 15,
        step: 1, // optional, defaults to 1 if omitted
        labels: { 1: "1", 12: "15+" }
},
      {
        id: "leadershipExperience",
        prompt: "How many years have you been in a leadership role?",
        type: "radio",
        options: ["Less than 1 year", "1-3 years", "3-5 years", "5+ years"],
      },
      {
        id: "leadershipJourney",
        prompt: "How would you describe yourself as a leader?",
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
        id: "confidenceLevel",
        prompt: "How confident are you in your decision-making abilities?",
        type: "likert",
        scale: [1, 2, 3, 4, 5],
        labels: { 1: "Not Confident", 5: "Very Confident" },
      },
      {
        id: "leadershipChallenge",
        prompt: "What’s your biggest leadership challenge today?",
        type: "radio",
        options: [
          "Decision-making", "Influence", "Conflict Resolution",
          "Time Management", "Delegation", "Emotional Intelligence",
          "Strategic Thinking", "Coaching & Mentoring"
        ],
      },
      {
        id: "leadershipDecision",
        prompt: "Describe a time you had to make a difficult decision as a leader?",
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
        id: "leadershipReflection",
        prompt: "If your leadership style had a ‘warning label,’ what would it say?",
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
        id: "confidenceMatrix",
        prompt: "Rate your skill in each of these leadership areas:",
        type: "matrix",
        rows: ["Decision-making", "Conflict Resolution", "Delegation"],
        columns: ["Poor", "Average", "Good", "Excellent"]
      },
    ],
  },
];

const LEPIntakeForm = () => {
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleChange = (id, value, isMultiSelect = false) => {
    setFormData((prev) => ({
      ...prev,
      [id]: isMultiSelect ? value : value,
    }));
  };

  // Restored correct ranking logic
  const handleDragEnd = (event, id) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormData((prev) => {
        const updatedList = arrayMove(
          prev[id] || sections.find(s => s.questions.some(q => q.id === id)).questions.find(q => q.id === id).options,
          prev[id]?.findIndex(i => i.id === active.id),
          prev[id]?.findIndex(i => i.id === over.id)
        );
        return { ...prev, [id]: updatedList };
      });
    }
  };

const [analysisResult, setAnalysisResult] = useState(null);

const handleSubmit = async (e) => {
  if (e) e.preventDefault();
  console.log("🚀 Form submission started...");
  console.log("📤 Form Data:", formData);

  try {
    const response = await fetch("/api/analyze-leadership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("🔍 Fetch request sent...");

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ AI Analysis Result:", result);

    setAnalysisResult(result.analysis); // Store the AI response in state

  } catch (error) {
    console.error("❌ Error submitting form:", error);
    alert("There was an issue submitting the form.");
  }
};
  
  const handleNext = async () => {
    const totalSections = sections.length;
    const totalQuestions = sections[currentSection].questions.length;
  
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < totalSections - 1) {
      setCurrentQuestion(0);
      setCurrentSection(currentSection + 1);
    } else {
      await handleSubmit(); // Ensures form submission completes before proceeding
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
      <div className="card shadow-lg p-5" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="text-center">
          <img src="/circle logo test.jpg" alt="LEP Logo" style={{ width: "150px", marginBottom: "15px" }} />
        </div>
  
        <div className="mb-4">
          <label className="form-label fw-semibold">
            {sections[currentSection].questions[currentQuestion].prompt}
          </label>
  
          {(() => {
            const q = sections[currentSection].questions[currentQuestion];
  
            if (q.type === "ranking") {
              return (
                <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, q.id)}>
                  <SortableContext items={formData[q.id] || q.options} strategy={verticalListSortingStrategy}>
                    {(formData[q.id] || q.options).map((item) => (
                      <SortableItem key={item.id} id={item.id}>
                        {item.text}
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
              );
            }
  
            if (q.type === "radio") {
              return q.options.map((opt) => (
                <div key={opt}>
                  <input type="radio" name={q.id} value={opt} onChange={() => handleChange(q.id, opt)} /> {opt}
                </div>
              ));
            }
            if (q.type === "slider") {
              return (
                <div className="d-flex flex-column">
                  <input
                    type="range"
                    name={q.id}
                    min={q.min}
                    max={q.max}
                    step={q.step || 1}
                    value={formData[q.id] || q.min}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="form-range"
                  />
                  <div className="d-flex justify-content-between mt-2">
                    <span>{q.labels?.[q.min] || q.min}</span>
                    <span>{formData[q.id] || q.min}</span>
                    <span>{q.labels?.[q.max] || q.max}</span>
                  </div>
                </div>
              );
            }

            if (q.type === "likert") {
              return (
                <div className="d-flex flex-column">
                  <div className="d-flex justify-content-between mb-2">
                    <span>{q.labels?.[q.scale[0]] || q.scale[0]}</span>
                    <span>{q.labels?.[q.scale[q.scale.length - 1]] || q.scale[q.scale.length - 1]}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    {q.scale.map((value) => (
                      <label key={value} className="text-center">
                        <input
                          type="radio"
                          name={q.id}
                          value={value}
                          onChange={() => handleChange(q.id, value)}
                          style={{ marginRight: "5px" }}
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                </div>
              );
            }

            if (q.type === "matrix") {
              return (
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      {q.columns.map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {q.rows.map((row) => (
                      <tr key={row}>
                        <td>{row}</td>
                        {q.columns.map((col) => (
                          <td key={col}>
                            <input
                              type="radio"
                              name={`${q.id}-${row}`}
                              onChange={() => handleChange(`${q.id}-${row}`, col)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            }
            if (q.type === "multi-select") {
              return (
                <div className="row">
                  {q.options.map((opt) => (
                    <div key={opt} className="col-md-4 d-flex align-items-center">
                      <input
                        type="checkbox"
                        name={q.id}
                        value={opt}
                        checked={formData[q.id]?.includes(opt) || false}
                        onChange={(e) => {
                          const selected = formData[q.id] || [];
                          if (e.target.checked && selected.length < q.limit) {
                            handleChange(q.id, [...selected, opt]);
                          } else if (!e.target.checked) {
                            handleChange(q.id, selected.filter(item => item !== opt));
                          }
                        }}
                      />
                      <label className="ms-2">{opt}</label>
                    </div>
                  ))}
                </div>
              );
            }
  
            return <textarea className="form-control" onChange={(e) => handleChange(q.id, e.target.value)} />;
          })()}
        </div>
  
        <button 
          onClick={handleNext} 
          className="btn w-100 py-2 fw-bold rounded-pill shadow-sm" 
          style={{ backgroundColor: "#212A37", color: "#FFFFFF", border: "none" }}
        >
          Next
        </button>
  
        {/* AI Analysis Display */}
        {analysisResult && (
  <div className="mt-4 p-3 bg-light border rounded">
    <h4 className="fw-bold">AI Leadership Analysis</h4>
    <p><strong>{analysisResult.split("\n")[0]}</strong></p> {/* Extract summary */}
    <ul>
      {analysisResult.split("\n").slice(1).map((point, index) => (
        point.trim() && <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
)}
      </div>
    </div>
  );
};

export default LEPIntakeForm; // ✅ Ensure the component is properly exported
