import React from 'react';
import './ErrorBanner.css';

export default function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="error-banner" role="alert">
      <div className="error-banner__inner">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="error-banner__text">{message}</span>
        <button className="error-banner__dismiss" onClick={onDismiss} aria-label="Dismiss error">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6"  y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}