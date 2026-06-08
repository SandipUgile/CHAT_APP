import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  { q: 'How do I start a new conversation?', a: 'Click the ✏️ (pencil) icon at the top of the left panel, then select a contact.' },
  { q: 'How do I create a group?', a: 'Go to the Groups tab in the left panel and click Create Group. Pick members, then set a name.' },
  { q: 'What happens when I block someone?', a: 'They cannot send you messages or see your Last Seen, profile photo, or status.' },
  { q: 'How do I star a message?', a: 'Right-click any message and select Star. Starred messages appear in Settings → Starred Messages.' },
  { q: 'Are messages encrypted?', a: 'Yes. All messages are end-to-end encrypted by default.' },
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="rp-header">
        <button className="back-btn" onClick={() => navigate('/settings')}>‹</button>
        <div><h2>Help & Support</h2><p>Find answers or contact us</p></div>
      </div>
      <div className="rp-body" style={{ maxWidth: 600 }}>
        <div className="card">
          <div className="card-section-label">Get Help</div>
          {[
            { icon: '📖', label: 'Help Center',      sub: 'Browse articles and guides',         action: () => alert('Opening Help Center...') },
            { icon: '📧', label: 'Contact Us',        sub: 'Send us an email',                    action: () => { window.location.href='mailto:support@signals.app'; } },
            { icon: '🚩', label: 'Report a Problem', sub: 'Tell us about bugs or issues',       action: () => alert('Report form — coming soon!') },
          ].map((row, i) => (
            <div key={i} className="s-row" onClick={row.action}>
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
          <div className="card-section-label">FAQ</div>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', textAlign: 'left', gap: 12 }}
              >
                <span>{faq.q}</span>
                <span style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: open === i ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>
              {open === i && <div style={{ padding: '0 16px 13px', fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>{faq.a}</div>}
            </div>
          ))}
        </div>

        <div className="version">Signals v1.0.0 · Made with ❤️</div>
      </div>
    </div>
  );
};

export default HelpSupport;
