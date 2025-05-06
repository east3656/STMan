// api/valid‑lines.js
import axios from 'axios';

export default async function handler(req, res) {
  // --- CORS for serverless (if needed) ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    return res.status(204).end();
  }

  // --- simple “only you” guard ---
  const userKey = req.query.key;
  if (!userKey || userKey !== process.env.SECRET_KEY) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const stm = await axios.get(
      'https://api.stm.info/pub/od/i3/v2/messages/etatservice',
      { headers: { apiKey: process.env.STM_API_KEY } }
    );
    // only forward the JSON body
    res.status(200).json(stm.data);
  } catch (err) {
    console.error('STM fetch error:', err.response?.status || err.message);
    const code = err.response?.status || 500;
    const body = err.response?.data || { error: err.message };
    res.status(code).json(body);
  }
}
