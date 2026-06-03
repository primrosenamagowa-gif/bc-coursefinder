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

  const userMsg = {
    role: 'user',
    content: userText.trim(),
    id: Date.now()
  };

  const updated = [...messagesRef.current, userMsg];

  syncMessages(updated);

  setIsLoading(true);

  try {

    const response = await fetch(
      'http://localhost:3000/api/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const assistantMsg = {
      role: 'assistant',
      content: data.reply,
      id: Date.now() + 1
    };

    syncMessages([...updated, assistantMsg]);

  } catch (err) {

    setError(
      err.message ||
      'Could not connect to CourseFinder backend.'
    );

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