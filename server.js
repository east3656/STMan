
const fs     = require('fs');
const path   = require('path');
const axios  = require('axios');
const express= require('express');
const cors   = require('cors');
const cron   = require('node-cron');

require('dotenv').config();
const app = express();
app.use(cors());
//listens regardless of port conflict

//where it caches the STM JSON
const CACHE_FILE = path.join(__dirname, 'stm-cache.json');

// helper: fetch & cache STM data
async function fetchAndCacheSTM() {
  try {
    console.log('Fetching STM data at', new Date().toISOString());
    const apiKey = process.env.STM_API_KEY;
    const resp   = await axios.get(
      'https://api.stm.info/pub/od/i3/v2/messages/etatservice',
      { headers: { apiKey } }
    );
    // write JSON to disk
    fs.writeFileSync(CACHE_FILE,
      JSON.stringify(resp.data, null, 2),
      'utf8'
    );
    console.log('STM data cached.');
  } catch (err) {
    console.error('STM fetch error:', err.message);
  }
}

//on startup, fetch immediately:
fetchAndCacheSTM();

//schedule two fetches per day: at 06:00 and 18:00, for departure and return from/to home.
cron.schedule('0 6 * * *',  fetchAndCacheSTM);
cron.schedule('0 18 * * *', fetchAndCacheSTM);

//endpoint now just reads the cached file:
app.get('/api/valid-lines', (req, res) => {
  if (!fs.existsSync(CACHE_FILE)) {
    return res.status(503).json({ error: 'Cache not ready' });
  }
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Cache read error' });
  }
});

// optionally, we serve our frontend from “public/ -IGNORE FOR NOW-”
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
