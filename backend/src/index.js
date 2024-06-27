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
  labelNames: ['route'],
  registers: [register]
});

// Define a Histogram for response times
const responseTimes = new promClient.Histogram({
  name: 'response_times',
  help: 'Histogram of response times by route',
  labelNames: ['route'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

// Define a Gauge for active requests
const activeRequests = new promClient.Gauge({
  name: 'active_requests',
  help: 'Number of active requests',
  registers: [register]
});

app.use(cors());
app.use(express.json());

// Middleware to increase counters, observe response time, and track active requests
app.use((req, res, next) => {
  const route = req.path;
  console.log(`Request received for route: ${route}`);
  activeRequests.inc(); // Increment active requests
  const end = responseTimes.startTimer({ route });

  res.on('finish', () => {
    console.log(`Incrementing counter for route: ${route}`);
    totalRequests.inc({ route });
    end();
    activeRequests.dec(); // Decrement active requests
    console.log(`Request processing finished for route: ${route}`);
  });

  next();
});

// Metric endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  console.log(await register.metrics()); // Verify metrics content in the console
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

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

// Test endpoint to manually increment metrics
app.get('/test', (req, res) => {
  totalRequests.inc({ route: 'test' });
  responseTimes.observe({ route: 'test' }, 1.5); // 1.5 seconds
  res.send('Test metrics incremented');
});

// Host the API on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
