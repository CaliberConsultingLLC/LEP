import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from "react";
import LEPIntakeForm from "./LEPIntakeForm";
import ResultsPage from "./ResultsPage";  // <-- This import is required!

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LEPIntakeForm />} />
              <Route path="/results" element={<ResultsPage />} />
          </Routes>
      </Router>
  );
}

export default App;
