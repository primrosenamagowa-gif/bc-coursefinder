import { useState, useCallback, useRef } from 'react';

export function useChat() {
  const [messages, setMessages]   = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);
  const messagesRef               = useRef([]);

  const syncMessages = (msgs) => {
    messagesRef.current = msgs;
    setMessages(msgs);
  };

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || isLoading) return;

    setError(null);

    const userMsg = { role: 'user', content: userText.trim(), id: Date.now() };
    const updated = [...messagesRef.current, userMsg];
    syncMessages(updated);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error || errData?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'Sorry, I could not generate a response.';

      const assistantMsg = {
        role: 'assistant',
        content: reply,
        id: Date.now() + 1,
      };
      syncMessages([...updated, assistantMsg]);

    } catch (err) {
      console.error('Chat API error:', err);
      setError(err.message || 'Connection error. Please check your internet.');
      syncMessages(messagesRef.current.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearMessages = useCallback(() => {
    syncMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}