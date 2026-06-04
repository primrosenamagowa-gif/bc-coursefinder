import { GoogleGenerativeAI } from "@google/generative-ai";

async function parseJsonBody(req) {
  if (req.body) return req.body;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? chunk : chunk.toString());
  }

  const raw = chunks.join('');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = await parseJsonBody(req);
  const message = body?.message?.toString().trim();

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  console.log('GEMINI key present:', !!apiKey, 'GEMINI_API_KEY:', !!process.env.GEMINI_API_KEY, 'VITE_GEMINI_API_KEY:', !!process.env.VITE_GEMINI_API_KEY);

  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', text: message }],
    });
    const response = await result.response;
    const reply = typeof response?.text === 'function'
      ? response.text()
      : response?.text || 'Sorry, I could not generate a response.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('API chat function error:', error);
    return res.status(500).json({ error: 'AI service unavailable. ' + (error.message || '') });
  }
}
