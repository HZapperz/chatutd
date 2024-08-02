import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about">
      <h2>What is ChatUTD?</h2>
      <p>
        ChatUTD is an anonymous chat platform where a new Question of the Day (QOTD) is posted every day
        to spark discussions and collect sentiment from the UTD community. The goal is to improve the social
        scene by encouraging open conversation on various topics.
      </p>
      <h3>How it works</h3>
      <ul>
        <li>A new question is posted daily</li>
        <li>Chat anonymously with other UTD community members</li>
        <li>Discussions are archived at the end of each day</li>
        <li>View past discussions in the Archive section</li>
      </ul>
      <p>Join the conversation and help shape the UTD community!</p>
    </div>
  );
};

export default About;