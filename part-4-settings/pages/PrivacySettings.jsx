import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPrivacySettingsThunk, updatePrivacyThunk } from '../store/slices/privacySlice';

const PrivacySettings = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const settings  = useSelector(s => s.privacy.settings);

  useEffect(() => { dispatch(fetchPrivacySettingsThunk()); }, [dispatch]);

  const update = (field, value) => dispatch(updatePrivacyThunk({ field, value }));

  const privacyRows = [
    { key: 'lastSeen',    label: 'Last Seen',    sub: 'Who can see when you were last online' },
    { key: 'profilePhoto',label: 'Profile Photo', sub: 'Who can see your profile picture' },
    { key: 'about',       label: 'About',         sub: 'Who can see your about info' },
    { key: 'status',      label: 'Status',        sub: 'Who can see your status updates' },
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <button className="back-btn" onClick={() => navigate('/settings')}>‹</button>
        <div><h2>Privacy</h2><p>Control who can see your information</p></div>
      </div>
      <div className="rp-body" style={{ maxWidth: 600 }}>
        <div className="card">
          <div className="card-section-label">Who Can See My Info</div>
          {privacyRows.map(row => (
            <div key={row.key} className="s-row" style={{ cursor: 'default' }}>
              <div className="s-row-body">
                <div className="s-row-label">{row.label}</div>
                <div className="s-row-sub">{row.sub}</div>
              </div>
              <div className="s-row-right">
                <select
                  value={settings?.[row.key] || 'Everyone'}
                  onChange={e => update(row.key, e.target.value)}
                  style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer', background: 'var(--panel-bg)' }}
                >
                  {['Everyone', 'My Contacts', 'Nobody'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-section-label">Messaging</div>
          <div className="s-row" style={{ cursor: 'default' }}>
            <div className="s-row-body">
              <div className="s-row-label">Read Receipts</div>
              <div className="s-row-sub">Show blue ticks when you read messages</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings?.readReceipts ?? true}
                onChange={e => update('readReceipts', e.target.checked)} />
              <span className="toggle-track" />
            </label>
          </div>
        </div>

        <div className="card">
          <div className="s-row" onClick={() => navigate('/settings/privacy/blocked')}>
            <div className="s-row-icon">🚫</div>
            <div className="s-row-body">
              <div className="s-row-label">Blocked Contacts</div>
              <div className="s-row-sub">Manage contacts you have blocked</div>
            </div>
            <span className="chevron">›</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
