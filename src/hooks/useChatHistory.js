import { useState, useCallback } from 'react';

export function useChatHistory() {
  const [history, setHistory]           = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const addChat = useCallback((firstMessage) => {
    const id    = Date.now();
    const title = firstMessage.length > 40
      ? firstMessage.slice(0, 40) + '…'
      : firstMessage;
    setHistory((prev) => [{ id, title, timestamp: new Date() }, ...prev]);
    setActiveChatId(id);
    return id;
  }, []);

  const setActive = useCallback((id) => {
    setActiveChatId(id);
  }, []);

  return { history, activeChatId, addChat, setActive };
}