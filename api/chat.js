import crypto from 'crypto';

async function parseJsonBody(req) {
  if (req.body) return req.body;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? chunk : chunk.toString());
  }

  const raw = chunks.join('');
  return raw ? JSON.parse(raw) : {};
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=+$/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function normalizePrivateKey(key) {
  return key.replace(/\\n/g, '\n');
}

function createJwtAssertion(serviceAccount) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const message = `${header}.${encodedPayload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(message);
  signer.end();
  const signature = signer.sign(normalizePrivateKey(serviceAccount.private_key), 'base64');
  const encodedSignature = signature
    .replace(/=+$/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${message}.${encodedSignature}`;
}

let serviceAccountTokenCache = null;

async function getServiceAccountAccessToken(serviceAccountJson) {
  if (!serviceAccountJson) {
    throw new Error('Service account credentials are missing.');
  }

  if (serviceAccountTokenCache && serviceAccountTokenCache.expiry > Date.now()) {
    return serviceAccountTokenCache.token;
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    try {
      const decoded = Buffer.from(serviceAccountJson, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decoded);
    } catch (err) {
      throw new Error('Invalid service account JSON.');
    }
  }

  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error('Invalid service account credentials.');
  }

  const jwtAssertion = createJwtAssertion(serviceAccount);
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtAssertion,
    }),
  });

  if (!tokenResponse.ok) {
    const errData = await tokenResponse.json().catch(() => ({}));
    throw new Error(errData.error_description || errData.error || `Token request failed: ${tokenResponse.status}`);
  }

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token || !tokenData.expires_in) {
    throw new Error('Invalid token response from Google OAuth endpoint.');
  }

  serviceAccountTokenCache = {
    token: tokenData.access_token,
    expiry: Date.now() + (tokenData.expires_in - 60) * 1000,
  };

  return tokenData.access_token;
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

  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.GOOGLE_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const apiKey = process.env.GENERATIVE_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  const useServiceAccount = !!serviceAccountJson;

  console.log(
    'Service account present:', useServiceAccount,
    'GENERATIVE_API_KEY:', !!process.env.GENERATIVE_API_KEY,
    'GOOGLE_API_KEY:', !!process.env.GOOGLE_API_KEY,
    'GEMINI_API_KEY:', !!process.env.GEMINI_API_KEY,
    'VITE_GEMINI_API_KEY:', !!process.env.VITE_GEMINI_API_KEY
  );

  if (!useServiceAccount && !apiKey) {
    return res.status(500).json({ error: 'Server is missing a valid generative AI API key or service account credentials.' });
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  let url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  if (useServiceAccount) {
    const token = await getServiceAccountAccessToken(serviceAccountJson);
    headers.Authorization = `Bearer ${token}`;
  } else if (apiKey.startsWith('ya29.')) {
    headers.Authorization = `Bearer ${apiKey}`;
  } else {
    headers['x-goog-api-key'] = apiKey;
    url += `?key=${encodeURIComponent(apiKey)}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [{ role: 'user', text: message }],
      }),
    });

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
