import React, { useState, useRef, useEffect } from 'react';
import './Messages.css'; // Import CSS file for styling
import WebSocketService from './WebSocketService';

function Messages({ userProfile }) {
  const [conversations, setConversations] = useState([]);  
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
    inputRef.current.focus();
    }

    // Establish WebSocket connection when component mounts
    WebSocketService.connect();
    WebSocketService.subscribeToMessages(handleNewMessage);

    return () => {
      // Close WebSocket connection when component unmounts
      WebSocketService.disconnect();
    };
  }, []);

  const handleNewMessage = (message) => {
    console.log(message);
    if (message.type === 'conversations') {
      setConversations(message.data);
    } else {
      // Update state with the new message
      setConversations(prevConversations => {
        const updatedConversations = [...prevConversations];
        updatedConversations[selectedConversationIndex].messages.push(message);
        return updatedConversations;
      });
    }
  };

  const handleConversationClick = (index) => {
    setSelectedConversationIndex(index);
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const updatedConversations = [...conversations];
    updatedConversations[selectedConversationIndex].messages.push({
      text: newMessage,
      sender: userProfile.fullName,
      time_sent: new Date().toISOString() // Add current time when sending a new message
    });
    setConversations(updatedConversations);
    setNewMessage('');
  };

  const ConversationList = () => {
    return (
      <div className="message-card ConversationList">
        <h2>Conversations</h2>
        {conversations.length === 0 ? (
          <p>No conversations available</p>
        ) : (
          <ul>
            {conversations.map((conversation, index) => {
              // Find the other user's name in the conversation
              const otherUser = conversation.users.find(user => user.id !== userProfile.id);
              // Display the other user's name if found
              return (
                <li key={conversation.id}>
                  <button onClick={() => handleConversationClick(index)}>
                    {otherUser ? otherUser.name : 'Unknown User'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };
  

  const MessageList = () => {
    const selectedConversation = conversations[selectedConversationIndex];
    const currentUser = userProfile.fullName;
  
    // Check if selectedConversation is defined and has the messages property
    if (!selectedConversation || !selectedConversation.messages) {
      return <p>No messages available</p>;
    }
  
    return (
      <div className="message-card MessageList">
        <h2>Messages</h2>
        <ul>
          {selectedConversation.messages.map((message, index) => (
            <li key={index} className={message.sender === currentUser ? 'sent' : 'received'}>
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-info">
                <span className="message-sender">{message.sender}</span>
                <span className="message-time">{new Date(message.time_sent).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="message-input">
          <input type="text" value={newMessage} style={{ width: '75%', height: '100%' }} onChange={handleInputChange} ref={inputRef} />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    );
  };
  


  return (
    <div className="Messages">
      <ConversationList />
      <MessageList />
    </div>
  );
}

export default Messages;
