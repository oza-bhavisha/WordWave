// Application on with RDS access
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

// RDS configuration
const db = mysql.createConnection({
  host: 'rds-db.cw1n07cd6oqu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'bhavisha',
  database: 'testrdsDB'
});

// Store products endpoint
app.post('/store-products', (req, res) => {
  const products = req.body.products;
  if (!Array.isArray(products)) {
    return res.status(400).send("Invalid input format");
  }
  products.forEach(product => {
    const { name, price, availability } = product;
    const query = `INSERT INTO products (name, price, availability) VALUES ('${name}', '${price}', ${availability})`;
    db.query(query, (err, result) => {
      if (err) throw err;
    });
  });
  res.sendStatus(200);
});

// List products endpoint
app.get('/list-products', (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
