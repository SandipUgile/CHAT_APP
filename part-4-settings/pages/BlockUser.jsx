import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContactThunk } from '../store/slices/contactSlice';
import { blockUserThunk, unblockUserThunk } from '../store/slices/privacySlice';
import ConfirmModal from '../components/ConfirmModal';

const initials = (name='') => name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

const BlockUser = () => {
  const { userId } = useParams();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const contacts   = useSelector(s => s.contact.contacts);
  const blocked    = useSelector(s => s.privacy.blockedUsers);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { dispatch(fetchContactThunk(userId)); }, [userId, dispatch]);

  const user      = contacts.find(c => c.id === userId);
  const isBlocked = blocked.some(b => b.id === userId);

  const handleConfirm = async () => {
    if (isBlocked) await dispatch(unblockUserThunk(userId));
    else           await dispatch(blockUserThunk(user));
    setShowModal(false);
    navigate(-1);
  };

  if (!user) return (
    <div className="welcome-screen"><div className="icon">👤</div><h2>User not found</h2></div>
  );

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <div><h2>{isBlocked ? 'Unblock Contact' : 'Block Contact'}</h2></div>
      </div>
      <div className="rp-body" style={{ maxWidth: 560 }}>
        <div className="profile-card">
          <div className={`avatar lg ${user.avatarColor || ''}`}>{initials(user.name)}</div>
          <div className="profile-card-info">
            <h2 style={{ color: 'var(--blue)' }}>{user.name}</h2>
            <p>{user.phone}</p>
            {isBlocked && <span className="tag tag-red" style={{ marginTop: 8, display: 'inline-flex' }}>🚫 Blocked</span>}
          </div>
        </div>

        {!isBlocked && (
          <div className="alert warning">
            <span>⚠️</span>
            <span>Blocking {user.name} means they cannot message you or see your profile information.</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button className={`btn ${isBlocked ? 'btn-primary' : 'btn-danger'}`} onClick={() => setShowModal(true)}>
            {isBlocked ? '✓ Unblock' : '🚫 Block'}
          </button>
        </div>
      </div>

      {showModal && (
        <ConfirmModal
          icon={isBlocked ? '✅' : '🚫'}
          title={isBlocked ? `Unblock ${user.name}?` : `Block ${user.name}?`}
          message={isBlocked ? 'They will be able to message you again.' : 'They will not be able to message or call you.'}
          confirmLabel={isBlocked ? 'Unblock' : 'Block'}
          danger={!isBlocked}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BlockUser;
