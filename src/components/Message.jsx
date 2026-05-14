import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Message.css';

function UserAvatar() {
  return (
    <div className="msg-avatar msg-avatar--user" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div className="msg-avatar msg-avatar--assistant" aria-hidden="true">
      <span>BC</span>
    </div>
  );
}

export default function Message({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`msg msg--${role}`}>
      <div className="msg__inner">
        {!isUser && <AssistantAvatar />}
        {isUser  && <UserAvatar />}
        <div className="msg__body">
          <span className="msg__name">{isUser ? 'You' : 'CourseFinder™'}</span>
          <div className={`msg__bubble msg__bubble--${role}`}>
            {isUser ? (
              <p>{content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p:      ({ children }) => <p className="md-p">{children}</p>,
                  strong: ({ children }) => <strong className="md-strong">{children}</strong>,
                  ul:     ({ children }) => <ul className="md-ul">{children}</ul>,
                  ol:     ({ children }) => <ol className="md-ol">{children}</ol>,
                  li:     ({ children }) => <li className="md-li">{children}</li>,
                  h1:     ({ children }) => <h3 className="md-h">{children}</h3>,
                  h2:     ({ children }) => <h3 className="md-h">{children}</h3>,
                  h3:     ({ children }) => <h3 className="md-h">{children}</h3>,
                  hr:     ()            => <hr className="md-hr" />,
                  code:   ({ children }) => <code className="md-code">{children}</code>,
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}