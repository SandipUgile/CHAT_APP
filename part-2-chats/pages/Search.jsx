import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchThunk } from '../store/slices/contactSlice';
import { setActiveChat } from '../store/slices/chatSlice';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const results  = useSelector(s => s.contact.searchResults);
  const loading  = useSelector(s => s.ui.loading);
  const chatList = useSelector(s => s.chat.chatList);

  const [query, setQuery] = useState('');
  const [tab,   setTab]   = useState('users');

  // Debounced search
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) dispatch(searchThunk(query));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const handleUserClick = (user) => navigate(`/contact/${user.id}`);

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <div style={{ flex: 1 }}>
          <div className="search-input" style={{ margin: 0 }}>
            <span className="search-icon">🔍</span>
            <input
              ref={inputRef}
              type="text" placeholder="Search messages, chats, and users..."
              value={query} onChange={e => setQuery(e.target.value)}
            />
            {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>}
          </div>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border)', display: 'flex' }}>
        {[
          { key: 'users',    label: 'People' },
          { key: 'chats',    label: 'Chats'  },
          { key: 'messages', label: 'Messages' },
        ].map(t => (
          <button key={t.key} className={`lp-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="rp-body" style={{ maxWidth: 640, padding: '16px 24px' }}>
        {!query.trim() ? (
          <div className="empty-state"><div className="icon">🔍</div><p>Start typing to search</p></div>
        ) : loading ? (
          <div className="empty-state"><p>Searching...</p></div>
        ) : (
          <>
            {tab === 'users' && (
              results.users?.length === 0
                ? <div className="empty-state"><div className="icon">👤</div><p>No people found for "{query}"</p></div>
                : <div className="card">
                    {results.users.map(u => (
                      <div key={u.id} className="contact-row" onClick={() => handleUserClick(u)}>
                        <div className={`avatar sm ${u.avatarColor || ''}`}>{initials(u.name)}</div>
                        <div className="contact-row-info"><h4>{u.name}</h4><p>{u.phone}</p></div>
                        <span className="chevron">›</span>
                      </div>
                    ))}
                  </div>
            )}
            {tab === 'chats' && (
              <div className="empty-state"><div className="icon">💬</div><p>Chat search — coming soon!</p></div>
            )}
            {tab === 'messages' && (
              <div className="empty-state"><div className="icon">📝</div><p>Message search — coming soon!</p></div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
