const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const promClient = require('prom-client');
const port = 3000;

// Prometheus metrics registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Define a Counter
const totalRequests = new promClient.Counter({
  name: 'total_requests',
  help: 'Total number of requests received',
  labelNames: ['route']
});

// Define a Histogram for response times
const responseTimes = new promClient.Histogram({
  name: 'response_times',
  help: 'Histogram of response times by route',
  labelNames: ['route'],
  buckets: [0.1, 0.5, 1, 2, 5] // in seconds
});

app.use(cors());
app.use(express.json());

// Middleware to increase counters and observe response time
app.use((req, res, next) => {
  const route = req.path;
  const end = responseTimes.startTimer({ route });

  res.on('finish', () => {
    totalRequests.inc({ route }); // Increment the counter for the route
    end(); // Stop the timer for the histogram when the response is finished
  });

  next();
});

// Metric endpoint for Prometheus to scrape
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(register.metrics());
});

// Your existing app code
// Dummy api request
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Get version of 'lib-version' api
app.get('/api/lib-version', (req, res) => {
  const libVersionPackage = require('@remla24-team12/lib-version');
  res.send(libVersionPackage.version);
});

// Get prediction from model-service API (forward request)
app.post('/api/prediction', (req, res) => {
  const modelServiceApiUrl = `${process.env.MODEL_SERVICE_URL}/predict`;

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
});
