// api/valid-lines.js
import axios from 'axios';

export default async function handler(req, res) {
  // allow your front‑end to fetch from here
  res.setHeader('Access-Control-Allow-Origin', '*');

  // only support GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const apiKey = process.env.STM_API_KEY;
    const resp   = await axios.get(
      'https://api.stm.info/pub/od/i3/v2/messages/etatservice',
      { headers: { apiKey } }
    );
    return res.status(200).json(resp.data);

  } catch (e) {
    console.error('STM proxy error:', e);
    const status = e.response?.status || 500;
    const body   = e.response?.data   || { error: e.message };
    return res.status(status).json(body);
  }
}
