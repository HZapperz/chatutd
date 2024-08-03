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

const RECONNECT_TIMEOUT = 5000; // 5 seconds

const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

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

  const fetchArchivedMessages = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/archive`);
      if (!response.ok) {
        throw new Error('Failed to fetch archived messages');
      }
      const archivedMessages = await response.json();
      setChatMessages(archivedMessages);
    } catch (error) {
      console.error('Error fetching archived messages:', error);
    }
  }, []);

  const connectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    eventSourceRef.current = new EventSource(`${SERVER_URL}/chat`);

    eventSourceRef.current.onopen = () => {
      console.log('SSE Connected');
      setIsConnected(true);
    };

    eventSourceRef.current.onmessage = (event) => {
      console.log('Message received:', event.data);
      const incomingMessage = JSON.parse(event.data);
      setChatMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    eventSourceRef.current.onerror = (error) => {
      console.error('SSE Error:', error);
      setIsConnected(false);
      eventSourceRef.current?.close();
      setTimeout(connectSSE, RECONNECT_TIMEOUT);
    };
  }, []);

  useEffect(() => {
    fetchArchivedMessages();
    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connectSSE, fetchArchivedMessages]);

  const sendMessage = async () => {
    if (inputMessage.trim() && isConnected) {
      const chatMessage: ChatMessage = {
        user_id: 'anonymous', // Replace this with an actual user ID if applicable
        message: inputMessage.slice(0, MAX_MESSAGE_LENGTH),
        timestamp: Math.floor(Date.now() / 1000),
      };
      
      try {
        const response = await fetch(`${SERVER_URL}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatMessage),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error (e.g., show an error message to the user)
      }
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
            <span className="message-timestamp">
              {new Date(msg.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="message-text">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
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
        <button className="send-button" onClick={sendMessage} disabled={!isConnected}>
          Send
        </button>
      </div>
      {showScrollButton && (
        <button className="scroll-down-button" onClick={enableAutoScroll}>
          ↓
        </button>
      )}
      {!isConnected && <div className="connection-status">Connecting...</div>}
    </div>
  );
};

export default ChatInterface;