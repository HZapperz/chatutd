import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import Archive from './pages/Archive';
import About from './pages/About';
import DevLogs from './pages/DevLogs';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <div className="qotd-banner">
            <p>Question of the Chat:</p>
            <p className="qotd">What are your feelings about UTD</p>
          </div>
          <div className="page-content">
            <Routes>
              <Route path="/" element={<ChatInterface />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/about" element={<About />} />
              <Route path="/devlogs" element={<DevLogs />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;