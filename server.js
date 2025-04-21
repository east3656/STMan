// server.js
const axios = require('axios');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// this will allow requests from any origin regardless of port conflict:
app.use(cors());

// define an endpoint that will call the STM API and return its JSON body to the frontend
app.get('/api/valid-lines', async (req, res) => {
  try {
    const apiKey = process.env.STM_API_KEY;
    console.log("Using API Key:", apiKey);
    
    // Make the call to the STM API.
    const response = await axios.get('https://api.stm.info/pub/od/i3/v2/messages/etatservice', {
      headers: { 'apiKey': apiKey }
    });
    
    // Send the actual API JSON body back to the client.
    res.json(response.data);
  } catch (error) {
    console.error('Error making API request:');
    
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).json({ error: "No response received from STM API" });
    } else {
      console.error("Error setting up request:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port${PORT}"));