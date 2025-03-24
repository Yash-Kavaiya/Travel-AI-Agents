import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import ResultsPage from './pages/ResultsPage';
import LoadingPage from './pages/LoadingPage';
import AboutPage from './pages/AboutPage';

// Types
import { TravelJob } from './types';

function App() {
  const [currentJob, setCurrentJob] = useState<TravelJob | null>(null);
  
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/planner" 
              element={<PlannerPage setCurrentJob={setCurrentJob} />} 
            />
            <Route 
              path="/loading/:jobId" 
              element={<LoadingPage currentJob={currentJob} />} 
            />
            <Route 
              path="/results/:jobId" 
              element={<ResultsPage currentJob={currentJob} />} 
            />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Travel AI Assistant</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;