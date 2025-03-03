import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from "react";
import LEPIntakeForm from "./LEPIntakeForm";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LEPIntakeForm />} />
              <Route path="/src" element={<ResultsPage />} />
          </Routes>
      </Router>
  );
}

export default App;
