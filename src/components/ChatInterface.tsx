import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import './ChatInterface.css';

interface ChatMessage {
  text: string;
  timestamp: Date;
}

const MAX_MESSAGE_LENGTH = 100;
const SCROLL_DELAY = 100; // ms
const SCROLL_THRESHOLD = 70; // px

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);

  const isScrolledToBottom = () => {
    const chatMessagesElement = chatMessagesRef.current;
    if (chatMessagesElement) {
      const scrollBottom = chatMessagesElement.scrollHeight - chatMessagesElement.clientHeight - chatMessagesElement.scrollTop;
      return scrollBottom <= SCROLL_THRESHOLD;
    }
    return true;
  };

  const scrollToBottom = useCallback(() => {
    isAutoScrollingRef.current = true;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, SCROLL_DELAY);
  }, []);

  useEffect(() => {
    if (isAutoScrollEnabled) {
      scrollToBottom();
    }
  }, [chatMessages, isAutoScrollEnabled, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (isAutoScrollingRef.current) return;

    const atBottom = isScrolledToBottom();
    setIsAutoScrollEnabled(atBottom);
    
    if (!atBottom) {
      setTimeout(() => {
        if (!isScrolledToBottom()) {
          setShowScrollButton(true);
        }
      }, SCROLL_DELAY);
    } else {
      setShowScrollButton(false);
    }
  }, []);

  const enableAutoScroll = () => {
    setIsAutoScrollEnabled(true);
    setShowScrollButton(false);
    scrollToBottom();
  };

  const handleSend = async () => {
    if (message.trim()) {
      const newMessage: ChatMessage = { text: message.slice(0, MAX_MESSAGE_LENGTH), timestamp: new Date() };
      
      try {
        // Send message to backend
        const response = await axios.post('http://localhost:3030/post', { message: newMessage.text }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: false, // Add this line
        });
        
        console.log('Server response:', response.data); // Add this line for debugging

        if (response.data.status === 'success') {
          // If successful, update chatMessages
          setChatMessages(prevMessages => [...prevMessages, newMessage]);
          setMessage('');
          setIsAutoScrollEnabled(true);
          setShowScrollButton(false);
        } else {
          console.error('Server responded with an error');
        }
      } catch (error) {
        console.error('There was an error sending the message:', error);
      }
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div 
        className={`chat-messages ${isAutoScrollEnabled ? 'auto-scroll' : ''}`} 
        ref={chatMessagesRef} 
        onScroll={handleScroll}
      >
        {chatMessages.map((msg, index) => (
          <div key={index} className="message-container">
            <span className="message-sender">Anonymous</span>
            <span className="message-timestamp">{formatTime(msg.timestamp)}</span>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {showScrollButton && (
        <button className="scroll-down-button" onClick={enableAutoScroll}>
          ↓
        </button>
      )}
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
