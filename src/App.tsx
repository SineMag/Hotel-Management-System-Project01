import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SpaPage from './pages/SpaPage';
import GymPage from './pages/GymPage';
import './App.css'; // Keep existing CSS if any

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue for primary elements
    },
    secondary: {
      main: '#f48fb1', // Pink for secondary elements
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e',   // Slightly lighter dark for paper elements
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b0b0b0', // Light grey secondary text
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/spa" element={<SpaPage />} />
          <Route path="/gym" element={<GymPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
