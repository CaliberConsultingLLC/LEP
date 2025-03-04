import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import LEPIntakeForm from "./LEPIntakeForm";
import ResultsPage from "./ResultsPage";
import CampaignBuilder from "./CampaignBuilder";  // Add this line

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LEPIntakeForm />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/campaign-builder" element={<CampaignBuilder />} /> {/* Add this */}
      </Routes>
    </Router>
  );
}

export default App;
