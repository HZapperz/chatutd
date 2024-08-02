import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatInterface.css';

interface ChatMessage {
  user_id: string;
  message: string;
  timestamp: number;
}

const MAX_MESSAGE_LENGTH = 100;
const SCROLL_DELAY = 100; // ms
const SCROLL_THRESHOLD = 70; // px
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);
  const websocket = useRef<WebSocket | null>(null);

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

  useEffect(() => {
    connectWebSocket();

    // Send a ping message every 30 seconds to keep the connection alive
    const pingInterval = setInterval(() => {
      if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
        websocket.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30 seconds interval

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
      clearInterval(pingInterval); // Cleanup ping interval
    };
  }, []);

  const connectWebSocket = () => {
    websocket.current = new WebSocket(`${SERVER_URL}/chat`);

    websocket.current.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
    };

    websocket.current.onmessage = (event) => {
        console.log('Message received:', event.data);
        const incomingMessage = JSON.parse(event.data);

        console.log('Parsed data:', incomingMessage);

        setChatMessages((prevMessages) => [
            ...prevMessages,
            ...(Array.isArray(incomingMessage) ? incomingMessage : [incomingMessage]),
        ]);
    };

    websocket.current.onclose = (event) => {
        console.log('WebSocket Disconnected:', event.reason || 'Unknown reason');
        setIsConnected(false);
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 5000);
    };

    websocket.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setIsConnected(false);
        // Consider attempting to reconnect or notify the user
    };
  };


  const sendMessage = () => {
    if (inputMessage.trim() && websocket.current?.readyState === WebSocket.OPEN) {
      const chatMessage: ChatMessage = {
        user_id: '1', // Replace this with an actual user ID if applicable
        message: inputMessage.slice(0, MAX_MESSAGE_LENGTH),
        timestamp: Math.floor(Date.now() / 1000),
      };
      websocket.current.send(JSON.stringify(chatMessage));
      setInputMessage('');
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
            <span className="message-sender">{msg.user_id}</span>
            <span className="message-timestamp">{new Date(msg.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="message-text">{msg.message}</div>
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
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={`Type your message here (${MAX_MESSAGE_LENGTH} characters max)`}
          disabled={!isConnected}
        />
        <button className="send-button" onClick={sendMessage} disabled={!isConnected}>Send</button>
      </div>
      {!isConnected && <div className="connection-status">Connecting...</div>}
    </div>
  );
};

export default ChatInterface;
