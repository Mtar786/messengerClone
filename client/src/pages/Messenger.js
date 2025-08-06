import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

/**
 * Messenger component.
 * Displays conversation list and messages and handles real‑time communication via Socket.io.
 */
function Messenger({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [users, setUsers] = useState({});

  const socket = useRef();

  // Initialize socket connection
  useEffect(() => {
    socket.current = io('http://localhost:5000');
    socket.current.emit('addUser', currentUser._id);
    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    // Cleanup on unmount
    return () => {
      socket.current.disconnect();
    };
  }, [currentUser]);

  // Append incoming messages to the chat if it belongs to the current conversation
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // Fetch conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/conversations/${currentUser._id}`
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser]);

  // Fetch messages when currentChat changes
  useEffect(() => {
    const getMessages = async () => {
      try {
        if (!currentChat) return;
        const res = await axios.get(
          `http://localhost:5000/api/messages/${currentChat._id}`
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  // Fetch user details for each conversation so that we can show names instead of IDs
  useEffect(() => {
    const getUsers = async () => {
      const newUsers = {};
      await Promise.all(
        conversations.map(async (conv) => {
          const friendId = conv.members.find((m) => m !== currentUser._id);
          if (!newUsers[friendId]) {
            try {
              const res = await axios.get(
                `http://localhost:5000/api/users/${friendId}`
              );
              newUsers[friendId] = res.data;
            } catch (err) {
              console.log(err);
            }
          }
        })
      );
      setUsers(newUsers);
    };
    if (conversations.length > 0) {
      getUsers();
    }
  }, [conversations, currentUser]);

  // Handle sending a message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = {
      conversationId: currentChat._id,
      sender: currentUser._id,
      text: newMessage,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== currentUser._id
    );

    // Emit the message through socket
    socket.current.emit('sendMessage', {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axios.post(
        'http://localhost:5000/api/messages',
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="messenger">
      {/* Conversation list */}
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <h3>Your Conversations</h3>
          {conversations.map((conv) => {
            const friendId = conv.members.find(
              (m) => m !== currentUser._id
            );
            const friendName =
              users[friendId]?.username || users[friendId]?.email || 'Friend';
            return (
              <div
                key={conv._id}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  backgroundColor:
                    currentChat?._id === conv._id ? '#f0f8ff' : 'transparent',
                }}
                onClick={() => setCurrentChat(conv)}
              >
                {friendName}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat box */}
      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop">
                {messages.map((msg, i) => (
                  <div
                    key={msg._id || i}
                    style={{
                      marginBottom: '10px',
                      textAlign:
                        msg.sender === currentUser._id ? 'right' : 'left',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor:
                          msg.sender === currentUser._id
                            ? '#d1e7dd'
                            : '#e2e3e5',
                        padding: '8px 12px',
                        borderRadius: '15px',
                        maxWidth: '70%',
                        wordWrap: 'break-word',
                      }}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  placeholder="write something…"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                />
                <button onClick={handleSubmit}>Send</button>
              </div>
            </>
          ) : (
            <span className="noConversationText">
              Open a conversation to start a chat.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messenger;