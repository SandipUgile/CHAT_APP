import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContactThunk } from '../store/slices/contactSlice';
import { createChatThunk, setActiveChat } from '../store/slices/chatSlice';

const initials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const ContactProfile = () => {
  const { userId } = useParams();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const contacts   = useSelector(s => s.contact.contacts);
  const blocked    = useSelector(s => s.privacy.blockedUsers);

  useEffect(() => { dispatch(fetchContactThunk(userId)); }, [userId, dispatch]);

  const user      = contacts.find(c => c.id === userId);
  const isBlocked = blocked.some(b => b.id === userId);

  const handleMessage = async () => {
    if (!user) return;
    const result = await dispatch(createChatThunk({ userId: user.id, contact: user }));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(setActiveChat(result.payload));
      navigate(`/chat/${result.payload.id}`);
    }
  };

  if (!user) return (
    <div className="welcome-screen"><div className="icon">👤</div><h2>Loading profile...</h2></div>
  );

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <div><h2>Contact Profile</h2></div>
      </div>
      <div className="rp-body" style={{ maxWidth: 560 }}>
        {/* Profile card */}
        <div className="profile-card">
          <div className={`avatar xl ${user.avatarColor || ''}`}>{initials(user.name)}</div>
          <div className="profile-card-info">
            <h2 style={{ color: 'var(--blue)' }}>{user.name}</h2>
            <p>{user.phone}</p>
            <p style={{ marginTop: 6 }}>{user.about}</p>
            {isBlocked && <span className="tag tag-red" style={{ marginTop: 8, display: 'inline-flex' }}>🚫 Blocked</span>}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleMessage}>💬 Message</button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => alert('Voice call — coming soon!')}>📞 Call</button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => alert('Video call — coming soon!')}>📹 Video</button>
        </div>

        {/* Options */}
        <div className="card">
          <div className="s-row" onClick={() => navigate('/starred')}>
            <div className="s-row-icon">⭐</div>
            <div className="s-row-body"><div className="s-row-label">Starred Messages</div></div>
            <span className="chevron">›</span>
          </div>
          <div className="s-row danger" onClick={() => navigate(`/user/${userId}/block`)}>
            <div className="s-row-icon" style={{ background: 'var(--danger-bg)' }}>🚫</div>
            <div className="s-row-body">
              <div className="s-row-label">{isBlocked ? 'Unblock User' : 'Block User'}</div>
            </div>
            <span className="chevron">›</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;
