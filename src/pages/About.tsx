import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about">
      <h2>What is ChatUTD?</h2>
      <p>
        ChatUTD is an anonymous chat platform designed to foster a greater sense of community within the UTD campus. 
        Whether you're a student, professor, alumni, or staff, ChatUTD offers a space for open and honest discussions 
        on various topics that matter to the UTD community. 
      </p>
      <p>
        The platform was created not only to bring the UTD community closer together but also as a project to enhance technical skills 
        and explore innovative features in the world of web development.
      </p>
      <h3>How it works</h3>
      <ul>
        <li>A new Question of the Chat is posted every few days to spark meaningful discussions</li>
        <li>Users chat anonymously with other members of the UTD community, encouraging honest and open communication</li>
        <li>At the end of each chat, discussions are archived for future reference, although they are not currently accessible to users</li>
      </ul>
      <h3>Future Plans</h3>
      <p>
        ChatUTD is constantly evolving, with new features being added weekly. On the roadmap are features ranging from upvotes to 
        p2p storage for messages. One of the long-term goals is to use sentiment analysis and 
        integrate it with a language model, enabling users to "Chat with UTD" itself and engage with the community in new ways.
      </p>
      <h3>Community Guidelines</h3>
      <p>
        ChatUTD values free speech and encourages users to speak their minds. However, while all opinions are welcome, 
        hateful language is not tolerated. The platform is designed to be a safe and respectful space for all members 
        of the UTD community.
      </p>
      <p>Join the conversation today and help shape the UTD community!</p>
    </div>
  );
};

export default About;
