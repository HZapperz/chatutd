import React, { useState, KeyboardEvent } from 'react';
import './ChatInterface.css';

interface ChatMessage {
  text: string;
  timestamp: Date;
}

const MAX_MESSAGE_LENGTH = 100;

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleSend = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { text: message.slice(0, MAX_MESSAGE_LENGTH), timestamp: new Date() }]);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className="message-container">
            <span className="message-sender">Anonymous</span>
            <span className="message-timestamp">{formatTime(msg.timestamp)}</span>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={`Type your message here (${MAX_MESSAGE_LENGTH} characters max)`}
        />
        <button className="send-button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;