const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Give the frontend CORS access
app.use(cors({
  origin: 'http://localhost:8080' // Vue app URL
}));

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
// TODO: Communicate with model-service
app.get('/api/prediction', (req, res) => {
  res.send(true);
});

// Host the API on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});