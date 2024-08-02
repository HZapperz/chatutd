import React from 'react';
import ChatInterface from '../components/ChatInterface';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <ChatInterface />
    </div>
  );
};

export default Home;