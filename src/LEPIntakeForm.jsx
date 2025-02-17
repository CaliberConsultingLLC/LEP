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
        prompt: "How many people are in your team?",
        type: "number",
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
        type: "dropdown",
        options: [
          "Decision-making", "Influence", "Conflict Resolution",
          "Time Management", "Delegation", "Emotional Intelligence",
          "Strategic Thinking", "Coaching & Mentoring"
        ],
      },
      {
        id: "teamDescription",
        prompt: "How would you describe the state of your team currently?",
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

  const handleNext = () => {
    if (sections[currentSection]) {
      const totalQuestions = sections[currentSection].questions.length;
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentSection < sections.length - 1) {
        setCurrentQuestion(0);
        setCurrentSection(currentSection + 1);
      }
    }
  };
  return (
    <div 
      className="d-flex align-items-center justify-content-center vh-100 w-100" 
      style={{ 
        backgroundImage: "url('/SM background 1.jpg')", 
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
          <label className="form-label fw-semibold">{sections[currentSection].questions[currentQuestion].prompt}</label>
  
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
  style={{ backgroundColor: "#212A37", color: "#FFFFFF", border: "none" }}>
  Next
</button>

      </div>
      </div>
  );
};

export default LEPIntakeForm;