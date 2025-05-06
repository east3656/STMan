// api/valid-lines.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    // Always fetch fresh data from STM
    const stmRes = await fetch(
      `https://api.stm.info/pub/od/i3/v2/messages/etatservice?apiKey=${process.env.STM_API_KEY}`
    );
    if (!stmRes.ok) {
      return res.status(502).json({ error: 'STM API error', status: stmRes.status });
    }
    const data = await stmRes.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

