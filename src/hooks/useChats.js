import { useState, useCallback, useRef } from 'react';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

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

    if (!API_KEY) {
      setError('API key not configured.');
      return;
    }

    setError(null);

    const userMsg = { role: 'user', content: userText.trim(), id: Date.now() };
    const updated = [...messagesRef.current, userMsg];
    syncMessages(updated);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':                              'application/json',
          'x-api-key':                                 API_KEY,
          'anthropic-version':                         '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system:     `You are BC CourseFinder™, an AI-powered career guidance assistant created exclusively for Belgium Campus — a leading private IT higher education institution in Johannesburg, South Africa. Your sole purpose is to help South African Matric (Grade 12) students make informed post-school decisions about pursuing IT-related studies at Belgium Campus.

## Your Role
You are a friendly, knowledgeable, and encouraging career advisor. Think of yourself as an older student mentor who wants to genuinely help learners navigate their future.

## What You Help With
- Exploring IT career paths: Software Development, Data Science, Cybersecurity, Networking, Cloud Computing, Game Development, UI/UX Design
- Understanding qualification types and pathways at Belgium Campus
- Subject prerequisites and APS score requirements
- Differences between IT specialisations
- Internships, learnerships, SETA programmes, and entry-level IT jobs in South Africa
- Skills required for specific IT careers
- Duration, structure, and progression of Belgium Campus programmes
- Bursaries, NSFAS, and funding options

## Belgium Campus Programmes
- Higher Certificate in IT: 1 year, accepts Maths Literacy, APS 14+
- Diploma in IT: Software Development: 3 years, requires Maths, APS 18+
- Diploma in IT: Data Science: 3 years, requires Maths, APS 18+
- Diploma in IT: Networking: 3 years, requires Maths, APS 18+
- Bachelor of Computing: 3 years, requires Maths, APS 22+

## Rules
1. Only answer questions about IT careers and Belgium Campus programmes.
2. If asked anything outside this scope say: "That is outside my area! I am here to help with IT career guidance at Belgium Campus."
3. Be warm, encouraging, and age-appropriate for Grade 12 students.
4. Use markdown formatting with bold, bullet points, and short paragraphs.
5. Always add: "Please confirm exact requirements with Belgium Campus admissions."`,
          messages: updated.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const data         = await response.json();
      const assistantMsg = {
        role:    'assistant',
        content: data.content?.[0]?.text || 'Sorry, I could not generate a response.',
        id:      Date.now() + 1,
      };
      syncMessages([...updated, assistantMsg]);

    } catch (err) {
      console.error('Error:', err);
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