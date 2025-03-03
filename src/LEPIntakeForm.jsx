import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import SortableItem from "./components/SortableItem.jsx";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Leadership Self-Perception",
    questions: [
      {
        id: "teamSize",
        prompt: "How many people do you directly manage?",
        type: "slider",
        min: 3,
        max: 15,
        step: 1,
        labels: { 1: "1", 15: "15+" }
      },
      {
        id: "leadershipExperience",
        prompt: "How many years have you been in a leadership role?",
        type: "radio",
        options: ["Less than 1 year", "1-3 years", "3-5 years", "5+ years"],
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
        id: "leadershipSuperpower",
        prompt: "What’s your leadership superpower — if it had to fit on a bumper sticker?",
        type: "radio",
        options: [
          "Big ideas, bold moves",
          "Human GPS for my team",
          "Making chaos look organized",
          "The glue holding it all together"
        ]
      },
      {
        id: "leadershipFuel",
        prompt: "What secretly fuels you as a leader (be honest)?",
        type: "radio",
        options: [
          "Seeing my people level up",
          "Crushing ambitious goals",
          "Solving problems no one else can touch",
          "Building a team people would fight to join"
        ]
      }
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
          "Set a strict deadline",
          "Offer additional support",
          "Re-evaluate priorities",
          "Consult the team for solutions"
        ],
      },
      {
        id: "conflictResponse",
        prompt: "When tension bubbles up in your team, what’s your gut-level first instinct?",
        type: "radio",
        options: [
          "Throw it all on the table and hash it out immediately",
          "Stay curious and watch how it unfolds",
          "Quietly pull people aside and work it out off-stage",
          "Hope it solves itself so I don’t have to"
        ]
      },
      {
        id: "mistakeReaction",
        prompt: "When someone on your team screws up, what’s your unfiltered inner monologue?",
        type: "radio",
        options: [
          "We’re gonna fix this together",
          "They better learn from this",
          "Ugh, I should’ve seen this coming",
          "Is it worth making a thing out of this?"
        ]
      },
      {
        id: "leadershipWarningLabel",
        prompt: "If your leadership style had a ‘warning label,’ what would it say?",
        type: "radio",
        options: [
          "May cause unintended chaos during high-speed innovation",
          "Handle with care — feedback hits harder than intended",
          "Warning: Over-involvement risk under pressure",
          "Contains 100% unfiltered honesty, no preservatives"
        ]
      },
      {
        id: "leadershipDecision",
        prompt: "Describe a time you had to make a difficult decision as a leader.",
        type: "text",
      },
      {
        id: "stressfulTask",
        prompt: "Which leadership task quietly (or loudly) stresses you out the most?",
        type: "radio",
        options: [
          "Giving tough feedback",
          "Asking for help when I need it",
          "Navigating team drama",
          "Delegating something I secretly want to control"
        ]
      }
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
        id: "invisibleEfforts",
        prompt: "What’s something you do for your team that no one notices, but you know it makes a difference?",
        type: "text",
      },
      {
        id: "teamDescription",
        prompt: "If your team had to describe your communication style in 3 words, what would you *hope* they say?",
        type: "text",
      },
      {
        id: "feedbackReaction",
        prompt: "When your team gives you feedback (the real kind, not just ‘all good’), how do you typically react?",
        type: "radio",
        options: [
          "Grateful – keep it coming",
          "Slightly defensive, but I’ll process it",
          "Uncomfortable, but I know it’s important",
          "It rarely happens, so it hits hard"
        ]
      },
      {
        id: "admiredTrait",
        prompt: "What leadership trait do you most admire in others?",
        type: "radio",
        options: ["Confidence", "Empathy", "Resilience", "Vision", "Decisiveness"]
      }
    ],
  },
  {
    title: "Feedback Preferences (AI Persona Customization)",
    questions: [
      {
        id: "feedbackFormality",
        prompt: "How formal do you want your feedback to be?",
        type: "slider",
        min: 1,
        max: 10,
        step: 1,
        labels: { 1: "Very Informal", 10: "Very Formal" }
      },
      {
        id: "feedbackTone",
        prompt: "How empathetic do you want your feedback to be?",
        type: "slider",
        min: 1,
        max: 10,
        step: 1,
        labels: { 1: "Very Harsh", 10: "Very Empathetic" }
      }
    ],
  },
]; 

const LEPIntakeForm = () => {
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  const navigate = useNavigate();

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

      if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ AI Analysis Result:", result);

      // Correct navigation with data
      navigate("/results", { state: { analysis: result.analysis } });

  } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("There was an issue submitting the form.");
  }
};
  
const handleNext = async () => {
  if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
  } else {
      await handleSubmit(); // Ensures form submission completes at the end
  }
};
 
const renderQuestion = (q) => {
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
              <input 
                  type="radio" 
                  name={q.id} 
                  value={opt} 
                  checked={formData[q.id] === opt} 
                  onChange={() => handleChange(q.id, opt)} 
              /> {opt}
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
                              checked={formData[q.id] === value}
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
                                      checked={formData[`${q.id}-${row}`] === col}
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

  return (
      <textarea
          className="form-control"
          value={formData[q.id] || ""}
          onChange={(e) => handleChange(q.id, e.target.value)}
      />
  );
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
    <div className="card shadow-lg p-5" style={{ maxWidth: "600px", width: "100%", minHeight: "400px", maxHeight: "85vh", overflowY: "auto" }}>
      <div className="text-center">
        <img src="/circle logo test.jpg" alt="LEP Logo" style={{ width: "150px", marginBottom: "15px" }} />
      </div>

      {/* Loop through all questions in the current section */}
      {sections[currentSection].questions.map((q) => (
        <div key={q.id} className="mb-4">
          <label className="form-label fw-semibold">{q.prompt}</label>

          {/* Use a dedicated renderQuestion function to handle types */}
          {renderQuestion(q)}
        </div>
      ))}

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
          <p><strong>{analysisResult.split("\n")[0]}</strong></p>
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
