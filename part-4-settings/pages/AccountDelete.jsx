import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteAccountThunk } from '../store/slices/authSlice';
import ConfirmModal from '../components/ConfirmModal';

const AccountDelete = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const loading   = useSelector(s => s.ui.loading);
  const user      = useSelector(s => s.auth.user);
  const [confirmed, setConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    await dispatch(deleteAccountThunk());
    navigate('/');
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <button className="back-btn" onClick={() => navigate('/settings/account')}>‹</button>
        <div><h2>Delete Account</h2><p>This action cannot be undone</p></div>
      </div>
      <div className="rp-body" style={{ maxWidth: 560 }}>
        <div className="alert danger" style={{ marginBottom: 20 }}>
          <span>⚠️</span>
          <span>Deleting your account will permanently remove all your messages, groups, and data.</span>
        </div>

        <div className="card">
          <div className="card-section-label">What will be deleted</div>
          {[
            { icon: '💬', text: 'All messages and chat history' },
            { icon: '👤', text: 'Your profile and account info' },
            { icon: '👥', text: 'You will be removed from all groups' },
            { icon: '🔒', text: 'This action is irreversible' },
          ].map((item, i) => (
            <div key={i} className="s-row" style={{ cursor: 'default' }}>
              <div className="s-row-icon">{item.icon}</div>
              <div className="s-row-body"><div className="s-row-label" style={{ fontWeight: 400 }}>{item.text}</div></div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--danger)', cursor: 'pointer' }}
              checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
            <span style={{ fontSize: '0.875rem' }}>I understand this cannot be undone</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/settings/account')}>Cancel</button>
          <button className="btn btn-danger" disabled={!confirmed || loading} onClick={() => setShowModal(true)}>
            {loading ? 'Deleting...' : '🗑️ Delete My Account'}
          </button>
        </div>
      </div>

      {showModal && (
        <ConfirmModal
          icon="⚠️" title="Delete Account?" danger
          message="All your data will be permanently removed. This cannot be undone."
          confirmLabel="Yes, Delete" onConfirm={handleDelete} onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AccountDelete;
