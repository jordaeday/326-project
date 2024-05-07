// import express from "express";
// import path from 'path';
// const __dirname = path.resolve();
// const app = express();
// const port = 3000;

// app.listen(port, () => {
//   console.log(`Destination Vacation server listening on port ${port}`);
// });

// app.use(express.static('./src/client'));

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, './src/client/index.html'));
// });

// app.post('/', (req, res) => {
//     res.send('Got a POST request: ' + req.body);
// });

// app.put('/', (req, res) => {
//     res.send('Got a PUT request: ' + req.body);
// });

// app.delete('/', (req, res) => {
//     res.send('Got a DELETE request: ' + req.body);
// });

import express from 'express';
import fetch from 'node-fetch'; // please install this first: npm install node-fetch
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZjc4OGU0MWMwNDYyYzExMjg4NzRiYzQ3NWQ4ODU0OWVlYjY2NGY2YTgxMWVmMDVkNTczYjM4N2U3MWFmYmMxMjQ0ZDZlNWM1YTdlOWJmOWYiLCJpYXQiOjE3MTQ5NzkxMjAsIm5iZiI6MTcxNDk3OTEyMCwiZXhwIjoxNzQ2NTE1MTIwLCJzdWIiOiIyMjUwNCIsInNjb3BlcyI6W119.KrMg7pjGNipTe9i3EIiIejXuaIZe9cBLBgDrVITYtT8VfeSHS0sqgiWlEdTl-dFh0K-b4noAFSdwOcgX__mcgA';  // Ensure your API key is correctly set

app.use(express.static(path.join(__dirname, '../client')));

app.get('/api/advanced-flights-schedules', async (req, res) => {
    const { iataCode, type } = req.query;
    if (!iataCode || !type) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const url = `https://app.goflightlabs.com/advanced-flights-schedules?access_key=${API_KEY}&iataCode=${iataCode}&type=${type}`;
    try {
        const apiResponse = await fetch(url);
        if (!apiResponse.ok) {
            throw new Error(`API request failed with status ${apiResponse.status}`);
        }
        const apiData = await apiResponse.json();
        res.json(apiData);
    } catch (error) {
        console.error('Failed to fetch data from external API:', error);
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

