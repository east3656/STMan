// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const STM_API_KEY = process.env.STM_API_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Proxy STM API requests
app.get('/api/service-status/:type/:number', async (req, res) => {
    const { type, number } = req.params;

    try {
        const response = await axios.get(`https://api.stm.info/pub/od/i3/v2/messages/etatservice`, {
            headers: {
                'apiKey': STM_API_KEY
            }
        });

        console.log("STM API Response:", response.data); // Debugging line

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching STM data:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch service status' });
    }
});

console.log("Using STM API Key:", STM_API_KEY);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
