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

  const handleDragEnd = (event, id, setState) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setState((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setFormData((prev) => ({ ...prev, [id]: [...items] }));
    }
  };

  const handleNext = () => {
    const totalQuestions = sections[currentSection].questions.length;
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(0);
      setCurrentSection(currentSection + 1);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
  <div className="card shadow-lg p-5" style={{ width: "500px" }}>
    <h2 className="text-center mb-3 fw-bold text-primary">Leadership Intake</h2>
    <h4 className="text-center text-secondary">{sections[currentSection].title}</h4>
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

        <button onClick={handleNext} className="btn btn-primary w-100 py-2 fw-bold rounded-pill shadow-sm">Next</button>
      </div>
    </div>
  );
};

export default LEPIntakeForm;
