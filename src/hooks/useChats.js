import { useState, useCallback, useRef } from 'react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('=== DEBUG ===');
console.log('API_KEY value:', API_KEY);
console.log('All env vars:', import.meta.env);

const MODEL = 'gemini-1.5-flash';
const SYSTEM = `You are BC CourseFinder™, an AI-powered career guidance assistant created exclusively for Belgium Campus — a leading private IT higher education institution in Johannesburg, South Africa. Your sole purpose is to help South African Matric (Grade 12) students make informed post-school decisions about pursuing IT-related studies at Belgium Campus.

## Your Role
You are a friendly, knowledgeable, and encouraging career advisor.

## Belgium Campus Programmes
- Higher Certificate in IT: 1 year, accepts Maths Literacy, APS 14+
- Diploma in IT: Software Development: 3 years, requires Maths, APS 18+
- Diploma in IT: Data Science: 3 years, requires Maths, APS 18+
- Diploma in IT: Networking: 3 years, requires Maths, APS 18+
- Bachelor of Computing: 3 years, requires Maths, APS 22+

## Rules
1. Only answer questions about IT careers and Belgium Campus programmes.
2. Be warm, encouraging, and age-appropriate for Grade 12 students.
3. Always add: "Please confirm exact requirements with Belgium Campus admissions."`;

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

    console.log('Sending message, API_KEY exists:', !!API_KEY);

    if (!API_KEY) {
      setError('⚠️ API key missing. Check Vercel environment variables.');
      return;
    }

    setError(null);

    const userMsg = { role: 'user', content: userText.trim(), id: Date.now() };
    const updated = [...messagesRef.current, userMsg];
    syncMessages(updated);
    setIsLoading(true);

    try {
      const geminiContents = updated.map(({ role, content }) => ({
        role:  role === 'assistant' ? 'model' : 'user',
        parts: [{ text: content }],
      }));

      const requestBody = {
        system_instruction: {
          parts: [{ text: SYSTEM }]
        },
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature:     0.7,
        },
      };

      console.log('Calling Gemini API...');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(requestBody),
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Error response:', errData);
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const data  = await response.json();
      console.log('Success:', data);

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
                    || 'Sorry, I could not generate a response.';

      const assistantMsg = {
        role:    'assistant',
        content: reply,
        id:      Date.now() + 1,
      };
      syncMessages([...updated, assistantMsg]);

    } catch (err) {
      console.error('Full error:', err);
      setError('AI service error: ' + err.message);
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