import React, { useState, useRef, useEffect } from 'react';
import './Messages.css'; // Import CSS file for styling

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Messages({ userProfile }) {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'John Doe', messages: [{ text: 'Hi there!', sender: 'Robot Two' }, { text: 'How are you?', sender: 'John Doe' }] },
    { id: 2, name: 'Jane Smith', messages: [{ text: 'Hey!', sender: 'Jane Smith' }, { text: 'I\'m good, thanks.', sender: 'Robot Two' }] },
  ]);
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus on the input field when component mounts or when conversation changes
    inputRef.current.focus();
  }, [selectedConversationIndex]);

  const debouncedNewMessage = useDebounce(newMessage, 300); // Adjust the delay as needed

  const handleConversationClick = (index) => {
    setSelectedConversationIndex(index);
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (debouncedNewMessage.trim() === '') return;
    const updatedConversations = [...conversations];
    updatedConversations[selectedConversationIndex].messages.push({
      text: debouncedNewMessage,
      sender: userProfile.fullName,
    });
    setConversations(updatedConversations);
    setNewMessage('');
  };

  const ConversationList = () => {
    return (
      <div className="message-card ConversationList">
        <h2>Conversations</h2>
        <ul>
          {conversations.map((conversation, index) => (
            <li key={conversation.id}>
              <button onClick={() => handleConversationClick(index)}>{conversation.name}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const MessageList = () => {
    const selectedConversation = conversations[selectedConversationIndex];
    const currentUser = userProfile.fullName;

    return (
      <div className="message-card MessageList">
        <h2>Messages</h2>
        <ul>
          {selectedConversation.messages.map((message, index) => (
            <li key={index} className={message.sender === currentUser ? 'sent' : 'received'}>
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-sender">
                {message.sender}
              </div>
            </li>
          ))}
        </ul>
        <div className="message-input">
          <input type="text" value={newMessage} style={{width: '75%', height: '100%'}} onChange={handleInputChange} ref={inputRef} />
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
