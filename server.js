// server.js (snippet)
const express = require('express');
const axios = require('axios');
const app = express();

// Example endpoint to fetch valid lines for a given type (bus/metro)
app.get('/api/valid-lines', async (req, res) => {
  const scheduleType = req.query.scheduleType; // 'bus' or 'metro'
  
  // Define the URL based on type (adjust these endpoints as needed)
  const apiUrl = scheduleType === 'bus' 
      ? 'https://api.stm.info/v1/bus-lines' 
      : 'https://api.stm.info/v1/metro-lines';  // Replace with actual endpoints

  try {
    // Call the STM Swagger API
    const response = await axios.get(apiUrl, {
      headers: {
        // Include any required headers or API keys here
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });
    
    // Parse the response according to the API documentation.
    // Suppose response.data is structured like: { lines: [ { number: '139', ... }, ... ] }
    const validLines = response.data.lines.map(line => line.number);

    // Send back the valid line numbers as JSON
    res.json({ lines: validLines });
  } catch (error) {
    console.error('Error fetching valid lines:', error);
    res.status(500).json({ error: 'Error fetching valid lines' });
  }
});

// (other routes and middleware)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
