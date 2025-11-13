import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SpaPage from './pages/SpaPage';
import GymPage from './pages/GymPage';
import './App.css'; // Keep existing CSS if any

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spa" element={<SpaPage />} />
        <Route path="/gym" element={<GymPage />} />
      </Routes>
    </Router>
  );
}

export default App;
