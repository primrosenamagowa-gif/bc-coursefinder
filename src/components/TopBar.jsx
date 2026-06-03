import React from 'react';
import './TopBar.css';
import { logoutUser } from '../auth/authService';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ messageCount, onToggleAPS })  {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <div className="topbar__avatar" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <div className="topbar__info">
          <h1 className="topbar__title">BC CourseFinder™</h1>
          <p className="topbar__subtitle">AI Career Guidance · Belgium Campus IT Programmes</p>
        </div>
      </div>
   <div className="topbar__right">

  <button
    className="topbar__badge"
    onClick={onToggleAPS}
  >
    <span className="topbar__badge-dot" />
    APS Calculator
  </button>

  <button
    className="topbar__badge"
    onClick={handleLogout}
  >
    Logout
  </button>

</div> 
      
    </header>
  );
}