import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const initials = (name='') => name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

const Settings = () => {
  const navigate = useNavigate();
  const user = useSelector(s => s.auth.user);

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <div>
          <h2>Settings</h2>
          <p>Manage your account and preferences</p>
        </div>
      </div>
      <div className="rp-body">
        {/* Profile card */}
        <div className="profile-card" style={{ marginBottom: 20 }}>
          <div className="avatar lg">{initials(user?.name || 'K')}</div>
          <div className="profile-card-info">
            <h2>{user?.name || 'Kaushik Munde'}</h2>
            <p>{user?.phone || '+91 98765 43210'}</p>
            <p style={{ marginTop: 4, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user?.about || 'Available'}</p>
          </div>
        </div>

        {/* Settings groups */}
        <div className="card">
          <div className="card-section-label">Account</div>
          {[
            { icon: '👤', label: 'Account Settings', sub: 'Phone, email, logout', path: '/settings/account' },
            { icon: '🔒', label: 'Privacy',           sub: 'Last seen, read receipts, blocked', path: '/settings/privacy' },
          ].map(row => (
            <div key={row.path} className="s-row" onClick={() => navigate(row.path)}>
              <div className="s-row-icon">{row.icon}</div>
              <div className="s-row-body">
                <div className="s-row-label">{row.label}</div>
                <div className="s-row-sub">{row.sub}</div>
              </div>
              <span className="chevron">›</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-section-label">Chats</div>
          {[
            { icon: '⭐', label: 'Starred Messages', sub: 'Messages you have saved', path: '/starred' },
            { icon: '📌', label: 'Pinned Chats',     sub: 'Your pinned conversations', path: '/pinned'  },
          ].map(row => (
            <div key={row.path} className="s-row" onClick={() => navigate(row.path)}>
              <div className="s-row-icon">{row.icon}</div>
              <div className="s-row-body">
                <div className="s-row-label">{row.label}</div>
                <div className="s-row-sub">{row.sub}</div>
              </div>
              <span className="chevron">›</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-section-label">Support</div>
          <div className="s-row" onClick={() => navigate('/settings/help')}>
            <div className="s-row-icon">❓</div>
            <div className="s-row-body">
              <div className="s-row-label">Help & Support</div>
              <div className="s-row-sub">FAQ, contact us, report a problem</div>
            </div>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="version">Signals v1.0.0</div>
      </div>
    </div>
  );
};

export default Settings;
