const axios = require('axios');
require('dotenv').config();

async function testSTMAPI() {
  try {
    // Get API key from ignored .env files.
    const apiKey = process.env.STM_API_KEY;
    
    console.log("Using API Key:", apiKey);
    
    const response = await axios.get(' https://api.stm.info/pub/od/i3/v2/messages/etatservice', {
      headers: {
        'apiKey': apiKey
      }
    });
    
    console.log("API Response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error making API request:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
  }
}

// Run the test function
testSTMAPI();