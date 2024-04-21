import React, { useState } from 'react';

function Messages() {
  // State to manage messages
  const [messages, setMessages] = useState([]);

  // Function to handle adding a new message
  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  // Component for rendering individual messages
  const MessageItem = ({ message }) => {
    return <div className="Message">{message}</div>;
  };

  // Component for rendering the message board
  const MessageBoard = () => {
    return (
      <div className="MessageBoard">
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
    );
  };

  // Component for adding new messages
  const AddMessageForm = () => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (newMessage.trim() !== '') {
        addMessage(newMessage);
        setNewMessage('');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="AddMessageForm">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Add Message</button>
      </form>
    );
  };

  return (
    <div className="Messages">
      <h1>Messages</h1>
      <AddMessageForm />
      <MessageBoard />
    </div>
  );
}

export default Messages;
