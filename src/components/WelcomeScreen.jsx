import React from 'react';
import { SUGGESTIONS } from '../utils/constants';
import './WelcomeScreen.css';

export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="welcome">
      <div className="welcome__hero">
        <div className="welcome__icon-wrap">
          <div className="welcome__icon"><span>BC</span></div>
          <div className="welcome__icon-ring" aria-hidden="true" />
        </div>
        <h2 className="welcome__heading">Hi! I'm CourseFinder™</h2>
        <p className="welcome__sub">
          Your AI-powered career guide for Belgium Campus IT programmes.
          Ask me about careers, subjects, qualifications, and your path after Matric.
        </p>
      </div>

      <div className="welcome__suggestions">
        <p className="welcome__suggestions-label">Popular questions</p>
        <div className="welcome__grid">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              className="suggestion-card"
              onClick={() => onSuggestionClick(s.prompt)}
              aria-label={s.prompt}
            >
              <span className="suggestion-card__icon" aria-hidden="true">{s.icon}</span>
              <span className="suggestion-card__label">{s.label}</span>
              <span className="suggestion-card__sub">{s.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}