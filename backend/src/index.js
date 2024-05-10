const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:8080' // Vue app URL
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});