const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const promClient = require('prom-client');
const port = 3000;
const os = require('os');

// Prometheus metrics registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Define a Counter for total requests
const totalRequests = new promClient.Counter({
  name: 'backend_total_requests',
  help: 'Total number of requests received',
  labelNames: ['route'],
  registers: [register]
});

// Define a Summary for response times
const responseTimeSummary = new promClient.Summary({
  name: 'backend_response_time_summary',
  help: 'Summary of response times by route in seconds',
  labelNames: ['route'],
  percentiles: [0.5, 0.9, 0.95, 0.99], // Define the percentiles you are interested in
  registers: [register]
});

// Define a Histogram for response times with more detailed buckets
const responseTimes = new promClient.Histogram({
  name: 'backend_response_times_histogram',
  help: 'Histogram of response times by route',
  labelNames: ['route'],
  buckets: [0.05, 0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5], // Buckets in seconds
  registers: [register]
});

// Define a Gauge for available RAM
const availableRam = new promClient.Gauge({
  name: 'backend_available_ram_bytes',
  help: 'Available system memory in bytes',
  labelNames: ['environment'],
  registers: [register]
});

// Define a Gauge for active requests
const activeRequests = new promClient.Gauge({
  name: 'backend_active_requests',
  help: 'Number of active requests',
  registers: [register]
});

const totalResponses = new promClient.Counter({
  name: 'backend_total_responses',
  help: 'Total number of HTTP responses',
  labelNames: ['status'],
  registers: [register]
});


// Periodically update the available RAM gauge
setInterval(() => {
  const freeMemory = os.freemem();
  availableRam.set({ environment: 'production' }, freeMemory);
}, 5000);

// Middleware to handle metrics
app.use(cors());
app.use(express.json());

// Middleware to increase counters, observe response time, and track active requests
app.use((req, res, next) => {
  const route = req.path;
  const start = process.hrtime();

  // Increment total requests counter
  totalRequests.inc({ route });

  activeRequests.inc(); // Increment active requests

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const elapsedTimeInSec = diff[0] + diff[1] / 1e9;

    // Use route as a label for detailed tracking
    responseTimeSummary.observe({ route }, elapsedTimeInSec);
    responseTimes.observe({ route }, elapsedTimeInSec);
    activeRequests.dec();

    // Update response counters with status code labels
    totalResponses.inc({ status: res.statusCode.toString() });
    if (res.statusCode === 200) {
      okResponses.inc({ status: '200' });
    }

    // Calculate and update percentage (optional enhancement)
  });

  next();
});

// Metric endpoint for Prometheus to scrape
app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Dummy API request
app.get('/api/', (req, res) => {
  res.send('Hello World!');
});

// Get version of 'lib-version' API
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
app.get('/api/test', (req, res) => {
  totalRequests.inc({ route: 'test' });
  responseTimes.observe({ route: 'test' }, 1.5); // 1.5 seconds
  res.send('Test metrics incremented');
});

// Host the API on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
