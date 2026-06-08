import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '../store/slices/authSlice';
import ConfirmModal from '../components/ConfirmModal';

const AccountSettings = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const user      = useSelector(s => s.auth.user);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login');
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <button className="back-btn" onClick={() => navigate('/settings')}>‹</button>
        <div><h2>Account</h2><p>Manage your account details</p></div>
      </div>
      <div className="rp-body" style={{ maxWidth: 600 }}>
        <div className="card">
          <div className="card-section-label">Details</div>
          {[
            { icon: '📱', label: 'Phone Number', value: user?.phone || '+91 98765 43210' },
            { icon: '📧', label: 'Email',        value: user?.email || 'kaushik@example.com' },
          ].map((row, i) => (
            <div key={i} className="s-row" style={{ cursor: 'default' }}>
              <div className="s-row-icon">{row.icon}</div>
              <div className="s-row-body">
                <div className="s-row-label">{row.label}</div>
                <div className="s-row-sub">{row.value}</div>
              </div>
            </div>
          ))}
          <div className="s-row" onClick={() => alert('Change number requires OTP flow — coordinate with OTP team')}>
            <div className="s-row-icon">🔄</div>
            <div className="s-row-body">
              <div className="s-row-label">Change Number</div>
              <div className="s-row-sub">Transfer account to a new number</div>
            </div>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="card">
          <div className="card-section-label">Session</div>
          <div className="s-row" onClick={() => setShowLogout(true)}>
            <div className="s-row-icon">🔓</div>
            <div className="s-row-body"><div className="s-row-label">Log Out</div><div className="s-row-sub">Sign out from this device</div></div>
            <span className="chevron">›</span>
          </div>
        </div>

        <div className="card">
          <div className="s-row danger" onClick={() => navigate('/settings/account/delete')}>
            <div className="s-row-icon" style={{ background: 'var(--danger-bg)' }}>🗑️</div>
            <div className="s-row-body">
              <div className="s-row-label">Delete My Account</div>
              <div className="s-row-sub">Permanently remove all your data</div>
            </div>
            <span className="chevron">›</span>
          </div>
        </div>
      </div>

      {showLogout && (
        <ConfirmModal
          icon="🔓" title="Log Out?" message="Are you sure you want to log out of Signals?"
          confirmLabel="Log Out"
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  );
};

export default AccountSettings;
