import { useState, useCallback, useRef } from 'react';
import { ANTHROPIC_MODEL, SYSTEM_PROMPT } from '../utils/constants';

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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updated.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.content?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';
      const assistantMsg = { role: 'assistant', content: replyText, id: Date.now() + 1 };
      syncMessages([...updated, assistantMsg]);
    } catch (err) {
      setError(err.message || 'Connection error. Please check your internet and try again.');
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