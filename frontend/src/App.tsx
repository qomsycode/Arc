import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import Dashboard from './views/Dashboard';
import LearnPage from './views/LearnPage';
import LessonView from './views/LessonView';
import BuildPage from './views/BuildPage';
import ChallengeView from './views/ChallengeView';
import AdminReviewPage from './views/AdminReviewPage';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { ready } = useAuth();

  // Don't render routes until Privy is ready
  if (!ready) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:id" element={<LessonView />} />
        <Route path="/build" element={<BuildPage />} />
        <Route path="/build/:id" element={<ChallengeView />} />
        <Route path="/admin" element={<AdminReviewPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
