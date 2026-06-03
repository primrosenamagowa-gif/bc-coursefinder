import React from 'react';
import QRCode from 'react-qr-code';
import './Sidebar.css';

export default function Sidebar({ history, activeChatId, onNewChat, onSelectChat }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon"><span><img src="images.png" width="38" height="45" alt="CourseFinder Logo" /></span></div>
        <div className="sidebar__logo-text">
          <p className="sidebar__logo-title">CourseFinder™</p>
          <p className="sidebar__logo-sub">Belgium Campus · IT</p>
        </div>
      </div>

      <button className="sidebar__new-btn" onClick={onNewChat} aria-label="Start new conversation">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5"  y1="12" x2="19" y2="12" />
        </svg>
        New Conversation
      </button>
 

      <div className="sidebar__history-section">
        {history.length > 0 && <p className="sidebar__history-label">Recent</p>}
        <div className="sidebar__history-list">
          {history.map((chat) => (
            <button
              key={chat.id}
              className={`sidebar__history-item ${chat.id === activeChatId ? 'sidebar__history-item--active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
              title={chat.title}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="sidebar__history-title">{chat.title}</span>
            </button>
          ))}
          {history.length === 0 && (
            <p className="sidebar__history-empty">Conversations will appear here</p>
          )}
        </div>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__footer-badge">
          <span className="sidebar__status-dot" />
          AI Agent Active
        </div>        <div className="sidebar__qr">
          <QRCode value="https://vercel.com/website11/bc-course-finderss/5VEKVJWVxgRG21bXZV1Xpi2ixXmQ" size={80} />
        </div>        <p className="sidebar__footer-copy">Belgium Campus · v1.0</p>
      </div>
    </aside>
  );
}