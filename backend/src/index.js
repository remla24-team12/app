const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const port = 3000;

// Give the frontend CORS access
app.use(cors());

app.use(express.json());

// Dummy api request
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Get version of 'lib-version' api
app.get('/api/lib-version', (req, res) => {
  const libVersionPackage = require('lib-version/package.json');
  res.send(libVersionPackage.version);
});

// Get prediction from model-service API (forward request)
app.post('/api/prediction', (req, res) => {
  const modelServiceApiUrl = 'http://127.0.0.1:5000/test';

  axios.post(modelServiceApiUrl, {
    input_data: { url: req.body.url }
  })
  .then(response => {
    res.send(response.data);
  })
  .catch(error => {
    console.error('Error calling the model-service API:', error);
    res.status(500).send('Internal Server Error');
  });
});

// Host the API on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});    console.error('Error fetching data:', error);
