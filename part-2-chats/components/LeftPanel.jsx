import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatsThunk, setActiveChat } from '../store/slices/chatSlice';
import { fetchGroupsThunk, setActiveGroup } from '../store/slices/groupSlice';
import { fetchStatusesThunk } from '../store/slices/statusSlice';
import { fetchContactsThunk } from '../store/slices/contactSlice';

// Helper: get initials from name
const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const LeftPanel = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();

  const [tab,   setTab]   = useState('chats');
  const [query, setQuery] = useState('');

  const { chatList, activeChat } = useSelector(s => s.chat);
  const { groups }               = useSelector(s => s.group);
  const { contactStatuses }      = useSelector(s => s.status);
  const user                     = useSelector(s => s.auth.user);

  useEffect(() => { dispatch(fetchChatsThunk()); }, [dispatch]);
  useEffect(() => { if (tab === 'groups')  dispatch(fetchGroupsThunk());   }, [tab, dispatch]);
  useEffect(() => { if (tab === 'status')  dispatch(fetchStatusesThunk()); }, [tab, dispatch]);
  useEffect(() => { if (tab === 'contacts') dispatch(fetchContactsThunk()); }, [tab, dispatch]);

  const filteredChats = chatList.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleChatClick = (chat) => {
    dispatch(setActiveChat(chat));
    navigate(`/chat/${chat.id}`);
  };

  const handleGroupClick = (group) => {
    dispatch(setActiveGroup(group));
    dispatch(setActiveChat({ id: group.chatId, name: group.name, isGroup: true, groupId: group.id, avatarColor: group.avatarColor }));
    navigate(`/chat/${group.chatId}`);
  };

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <>
      {/* Header */}
      <div className="lp-header">
        <span className="lp-logo">📡 Signals</span>
        <div className="lp-header-actions">
          <button className="icon-btn" title="New message" onClick={() => navigate('/new-message')}>✏️</button>
          <button className="icon-btn" title="Search"      onClick={() => navigate('/search')}>🔍</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="lp-tabs">
        {[
          { key: 'chats',    label: 'Chats'  },
          { key: 'groups',   label: 'Groups' },
          { key: 'status',   label: 'Status' },
        ].map(t => (
          <button
            key={t.key}
            className={`lp-tab${tab === t.key ? ' active' : ''}`}
            onClick={() => { setTab(t.key); setQuery(''); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-wrap">
        <div className="search-input">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={`Search ${tab}...`}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="lp-list">
        {/* ── CHATS TAB ── */}
        {tab === 'chats' && (
          filteredChats.length === 0
            ? <div className="empty-state"><div className="icon">💬</div><p>No chats yet</p></div>
            : filteredChats.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-row${activeChat?.id === chat.id ? ' active' : ''}`}
                  onClick={() => handleChatClick(chat)}
                >
                  <div className={`avatar ${chat.avatarColor || ''}`}>{initials(chat.name)}</div>
                  <div className="chat-row-body">
                    <div className="chat-row-top">
                      <span className="chat-row-name">{chat.name}</span>
                      <span className="chat-row-time">{chat.timestamp}</span>
                    </div>
                    <div className="chat-row-bottom">
                      <span className="chat-row-preview">
                        {chat.isGroup ? '👥 ' : ''}{chat.lastMessage || 'No messages yet'}
                      </span>
                      {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                    </div>
                  </div>
                </div>
              ))
        )}

        {/* ── GROUPS TAB ── */}
        {tab === 'groups' && (
          <>
            <div style={{ padding: '10px 16px' }}>
              <button className="btn btn-primary btn-sm btn-block" onClick={() => navigate('/groups/create')}>
                + Create Group
              </button>
            </div>
            {filteredGroups.length === 0
              ? <div className="empty-state"><div className="icon">👥</div><p>No groups yet</p></div>
              : filteredGroups.map(group => (
                  <div key={group.id} className="chat-row" onClick={() => handleGroupClick(group)}>
                    <div className={`avatar ${group.avatarColor || ''}`}>{initials(group.name)}</div>
                    <div className="chat-row-body">
                      <div className="chat-row-top">
                        <span className="chat-row-name">{group.name}</span>
                        <span className="chat-row-time">{group.members?.length} members</span>
                      </div>
                      <div className="chat-row-bottom">
                        <span className="chat-row-preview">{group.description || 'Group chat'}</span>
                      </div>
                    </div>
                  </div>
                ))
            }
          </>
        )}

        {/* ── STATUS TAB ── */}
        {tab === 'status' && (
          <div>
            {/* My status row */}
            <div className="section-head">My Status</div>
            <div className="status-row" onClick={() => navigate('/status')}>
              <div className="avatar">{initials(user?.name || 'K')}</div>
              <div className="contact-row-info">
                <h4>My Status</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tap to add status</p>
              </div>
            </div>
            <div className="section-head">Recent Updates</div>
            {contactStatuses.length === 0
              ? <div className="empty-state"><div className="icon">🌟</div><p>No updates yet</p></div>
              : contactStatuses.map(s => (
                  <div key={s.userId} className="status-row" onClick={() => navigate(`/status`)}>
                    <div className="status-ring">
                      <div className={`avatar ${s.avatarColor || ''}`}>{initials(s.name)}</div>
                    </div>
                    <div className="contact-row-info">
                      <h4>{s.name}</h4>
                      <p>{s.time}</p>
                    </div>
                  </div>
                ))
            }
          </div>
        )}
      </div>

      {/* Bottom — settings link */}
      <div className="lp-bottom">
        <div
          className={`chat-row${isActiveRoute('/settings') ? ' active' : ''}`}
          style={{ padding: '12px 16px', cursor: 'pointer' }}
          onClick={() => navigate('/settings')}
        >
          <div className="avatar" style={{ background: 'var(--panel-bg)', color: 'var(--text-sub)', fontSize: '1.1rem' }}>⚙️</div>
          <div className="chat-row-body">
            <div className="chat-row-name" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Settings</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftPanel;
