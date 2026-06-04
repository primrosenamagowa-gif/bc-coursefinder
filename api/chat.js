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
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', text: message }],
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.output?.[0]?.content?.[0]?.text || 'Sorry, I could not generate a response.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('API chat function error:', error);
    return res.status(500).json({ error: 'AI service unavailable. ' + (error.message || '') });
  }
}
