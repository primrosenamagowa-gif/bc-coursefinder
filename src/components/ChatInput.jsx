import React, { useState, useRef, useEffect } from 'react';
import { QUICK_PILLS } from '../utils/constants';
import './ChatInput.css';

export default function ChatInput({ onSend, isLoading, showPills }) {
  const [value, setValue] = useState('');
  const textareaRef       = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="chat-input-area">
      <div className="chat-input-wrap">
        {showPills && (
          <div className="chat-pills" role="list" aria-label="Quick suggestions">
            {QUICK_PILLS.map((pill, i) => (
              <button
                key={i}
                className="chat-pill"
                onClick={() => onSend(pill.prompt)}
                disabled={isLoading}
                role="listitem"
              >
                {pill.label}
              </button>
            ))}
          </div>
        )}

        <div className={`chat-input-box ${isLoading ? 'chat-input-box--loading' : ''}`}>
          <textarea
            ref={textareaRef}
            className="chat-input-textarea"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about IT careers, subjects, qualifications…"
            rows={1}
            disabled={isLoading}
            aria-label="Type your message"
          />
          <button
            className={`chat-send-btn ${canSend ? 'chat-send-btn--active' : ''}`}
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="spin-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none" />
              </svg>
            )}
          </button>
        </div>

        <p className="chat-input-footer">
          CourseFinder™ provides guidance for Belgium Campus IT programmes.&nbsp;
          <span>Confirm final details with admissions.</span>
        </p>
      </div>
    </div>
  );
}