import React, { useRef, useEffect, useState, useCallback } from 'react';
import Sidebar         from './components/Sidebar';
import TopBar          from './components/TopBar';
import WelcomeScreen   from './components/WelcomeScreen';
import Message         from './components/Message';
import TypingIndicator from './components/TypingIndicator';
import ChatInput       from './components/ChatInput';
import ErrorBanner     from './components/ErrorBanner';
import { useChat }     from './hooks/useChats';
import { useChatHistory } from './hooks/useChatHistory';
import APSCalculator from "./APSCalculator";
import './styles/global.css';
import './App.css';

export default function App() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const { history, activeChatId, addChat, setActive }              = useChatHistory();
  const chatBottomRef = useRef(null);
  const [localError, setLocalError] = useState(null);
  const [showAPS, setShowAPS] = useState(false);
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleSend = useCallback((text) => {
    if (!hasLoggedRef.current && text.trim()) {
      addChat(text.trim());
      hasLoggedRef.current = true;
    }
    sendMessage(text);
  }, [sendMessage, addChat]);

  const handleNewChat = useCallback(() => {
    clearMessages();
    hasLoggedRef.current = false;
    setLocalError(null);
  }, [clearMessages]);

  const handleSelectChat = useCallback((id) => {
    setActive(id);
  }, [setActive]);

  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <div className="app-layout">
      <Sidebar
        history={history}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      <div className="app-main">
        <TopBar
  messageCount={messages.length}
  onToggleAPS={() => setShowAPS(!showAPS)}
/>
        <div className="app-chat-area" role="log" aria-live="polite" aria-label="Conversation">
          <div className="app-chat-inner">
            {showAPS && (
  <div className="aps-dropdown">
    <APSCalculator />
  </div>
)}
            {showWelcome && <WelcomeScreen onSuggestionClick={handleSend} />}
            {messages.map((msg) => (
              <Message key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={chatBottomRef} aria-hidden="true" />
          </div>
        </div>
        {localError && (
          <ErrorBanner message={localError} onDismiss={() => setLocalError(null)} />
        )}
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          showPills={messages.length === 0}
        />
      </div>
    </div>
  );
}
