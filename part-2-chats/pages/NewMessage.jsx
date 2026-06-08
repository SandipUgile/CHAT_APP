import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContactsThunk } from '../store/slices/contactSlice';
import { createChatThunk, setActiveChat } from '../store/slices/chatSlice';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const NewMessage = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const contacts  = useSelector(s => s.contact.contacts);
  const [query, setQuery] = useState('');

  useEffect(() => { dispatch(fetchContactsThunk()); }, [dispatch]);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.phone.includes(query)
  );

  const handleSelect = async (contact) => {
    const result = await dispatch(createChatThunk({ userId: contact.id, contact }));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(setActiveChat(result.payload));
      navigate(`/chat/${result.payload.id}`);
    }
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <div><h2>New Message</h2><p>Select a contact to start chatting</p></div>
      </div>
      <div className="rp-body" style={{ maxWidth: 560, padding: '16px 24px' }}>
        <div className="search-input" style={{ marginBottom: 16 }}>
          <span className="search-icon">🔍</span>
          <input
            type="text" placeholder="Search contacts..."
            value={query} onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="card">
          {filtered.length === 0
            ? <div className="empty-state"><div className="icon">👤</div><p>No contacts found</p></div>
            : filtered.map(c => (
                <div key={c.id} className="contact-row" onClick={() => handleSelect(c)}>
                  <div className={`avatar sm ${c.avatarColor || ''}`}>{initials(c.name)}</div>
                  <div className="contact-row-info">
                    <h4>{c.name}</h4>
                    <p>{c.phone}</p>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default NewMessage;
