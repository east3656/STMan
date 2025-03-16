// server.js
const express = require('express'); //express.js framework for web server creation in Node.js
const axios = require('axios'); //axios library for https requests (for STM API calls)
const cors = require('cors'); //cors for communication between frontend and backend when both are using different domains and or ports
require('dotenv').config(); //.env file loading to use environment variables. you can look it up on npm later

const app = express(); //Express application instance created and stored in app.
const PORT = process.env.PORT || 3000; //PORT uses PORT env var first before going for the default port value of 3000

//setting up middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serving HTML/CSS/JS files

