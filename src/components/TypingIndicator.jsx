import React from 'react';
import './TypingIndicator.css';

export default function TypingIndicator() {
  return (
    <div className="typing-row" role="status" aria-label="CourseFinder is typing">
      <div className="typing-avatar" aria-hidden="true"><span>BC</span></div>
      <div className="typing-body">
        <span className="typing-name">CourseFinder™</span>
        <div className="typing-bubble">
          <div className="typing-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
          <span className="typing-label">Thinking…</span>
        </div>
      </div>
    </div>
  );
}