import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessagesThunk, sendMessageThunk, setActiveChat } from '../store/slices/chatSlice';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const ChatScreen = () => {
  const { chatId }   = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const messagesEnd  = useRef(null);

  const chatList   = useSelector(s => s.chat.chatList);
  const messages   = useSelector(s => s.chat.messages[chatId] || []);
  const activeChat = useSelector(s => s.chat.activeChat);
  const currentUser = useSelector(s => s.auth.user);

  const [text, setText] = useState('');

  // Find the chat from chatList if activeChat not set
  useEffect(() => {
    if (!activeChat || activeChat.id !== chatId) {
      const chat = chatList.find(c => c.id === chatId);
      if (chat) dispatch(setActiveChat(chat));
    }
  }, [chatId, chatList, activeChat, dispatch]);

  useEffect(() => {
    dispatch(fetchMessagesThunk(chatId));
  }, [chatId, dispatch]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(sendMessageThunk({ chatId, text: text.trim() }));
    setText('');
  };

  const handleHeaderClick = () => {
    if (activeChat?.isGroup && activeChat?.groupId) {
      navigate(`/group/${activeChat.groupId}/info`);
    } else if (activeChat?.userId) {
      navigate(`/contact/${activeChat.userId}`);
    }
  };

  const chat = activeChat?.id === chatId ? activeChat : chatList.find(c => c.id === chatId);
  if (!chat) return <div className="welcome-screen"><p>Chat not found.</p></div>;

  return (
    <div className="chat-screen">
      {/* Header */}
      <div className="chat-header" onClick={handleHeaderClick}>
        <div className={`avatar sm ${chat.avatarColor || ''}`}>{initials(chat.name)}</div>
        <div className="chat-header-info">
          <h3>{chat.name}</h3>
          <p>{chat.isGroup ? `${chat.members?.length || ''} members · group chat` : 'Online'}</p>
        </div>
        <div className="chat-header-actions">
          <button className="icon-btn dark" title="Search in chat">🔍</button>
          <button className="icon-btn dark" title="More options">⋮</button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px', fontSize: '0.85rem' }}>
            No messages yet. Say hello! 👋
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine = msg.senderId === 'u0' || msg.senderId === currentUser?.id;
          const showSender = chat.isGroup && !isMine;
          return (
            <div key={msg.id || i} className={`msg-wrap ${isMine ? 'mine' : 'theirs'}`}>
              {!isMine && chat.isGroup && (
                <div className={`avatar sm ${''}`} style={{ alignSelf: 'flex-end' }}>
                  {initials(msg.senderName || '?')}
                </div>
              )}
              <div>
                {showSender && <div className="msg-sender-name">{msg.senderName}</div>}
                <div className={`bubble ${isMine ? 'mine' : 'theirs'}`}>
                  {msg.text}
                  <div className="bubble-time">{msg.timestamp}</div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <form className="msg-input-bar" onSubmit={handleSend}>
        <button type="button" className="icon-btn dark" title="Attach file">📎</button>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" className="send-btn" disabled={!text.trim()}>➤</button>
      </form>
    </div>
  );
};

export default ChatScreen;
