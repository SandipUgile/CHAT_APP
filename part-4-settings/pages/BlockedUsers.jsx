import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlockedUsersThunk } from '../store/slices/privacySlice';

const initials = (name='') => name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

const BlockedUsers = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const blocked   = useSelector(s => s.privacy.blockedUsers);

  useEffect(() => { dispatch(fetchBlockedUsersThunk()); }, [dispatch]);

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <button className="back-btn" onClick={() => navigate('/settings/privacy')}>‹</button>
        <div><h2>Blocked Contacts</h2><p>{blocked.length} contact{blocked.length !== 1 ? 's' : ''} blocked</p></div>
      </div>
      <div className="rp-body" style={{ maxWidth: 560 }}>
        {blocked.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="icon">🚫</div>
              <h3>No blocked contacts</h3>
              <p>People you block cannot message or call you.</p>
            </div>
          </div>
        ) : (
          <div className="card">
            {blocked.map(user => (
              <div key={user.id} className="s-row" onClick={() => navigate(`/user/${user.id}/block`)}>
                <div className={`avatar sm ${user.avatarColor || ''}`}>{initials(user.name)}</div>
                <div className="s-row-body">
                  <div className="s-row-label">{user.name}</div>
                  <div className="s-row-sub">{user.phone}</div>
                </div>
                <span className="tag tag-red">Blocked</span>
                <span className="chevron">›</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedUsers;
