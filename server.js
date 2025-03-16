// server.js
const express = require('express'); //express.js framework for web server creation in Node.js
const axios = require('axios'); //axios library for https requests (for STM API calls)
const cors = require('cors'); //cors for communication between frontend and backend when both are using different domains and or ports
require('dotenv').config(); //.env file loading to use environment variables. you can look it up on npm later

// actual API credentials (in .gitignore)
const STM_API_KEY = process.env.STM_API_KEY;
const STM_CLIENT_SECRET = process.env.STM_CLIENT_SECRET;


const app = express(); //Express application instance created and stored in app.
const PORT = process.env.PORT || 3000; //PORT uses PORT env var first before going for the default port value of 3000

//setting up middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serving HTML/CSS/JS files

//Routing to proxy STM API requests
app.get('/api/service-status', async (req, res) => {
    try {
        const STM_API_KEY = process.env.STM_API_KEY;
        
        // Make request to STM API
        const response = await axios.get('https://api.stm.info/api/v1/status', {
            headers: {
                'apiKey': STM_API_KEY
            }
        });
        
        //Returning data to client
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching STM data:', error);
        res.status(500).json({ error: 'Failed to fetch service status' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



