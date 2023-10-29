// Application with Redis access
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
app.use(bodyParser.json());

// Redis configuration
const redisClient = redis.createClient(6379, 'YOUR_REDIS_ENDPOINT');

// Store products endpoint
app.post('/store-products', (req, res) => {
  const products = req.body.products;
  if (!Array.isArray(products)) {
    return res.status(400).send("Invalid input format");
  }
  redisClient.set("products", JSON.stringify(products), (err, reply) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

// List products endpoint
app.get('/list-products', (req, res) => {
  redisClient.get("products", (err, reply) => {
    if (err) throw err;
    if (reply) {
      res.status(200).json(JSON.parse(reply));
    } else {
      res.status(404).send("No products found in the cache");
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
