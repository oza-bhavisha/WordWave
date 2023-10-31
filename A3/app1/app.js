import express from "express";
import mysql from "mysql"; 
import axios from "axios";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("combined"));

const dbConfig = {
  host: "a3-rds-db.cw1n07cd6oqu.us-east-1.rds.amazonaws.com",
  user: 'admin',
  password: 'password',
  database: 'a3',
};

const dbClient = mysql.createConnection(dbConfig);

const insertProducts = async (products) => {
  const insertQuery = `
    INSERT INTO products (name, price, availability) VALUES ?`;
  const productValues = products.map(p => [p.name, p.price, p.availability]);
  await dbClient.query(insertQuery, [productValues]);
};

app.post("/store-products", async (req, res) => {
  try {
    const { products } = req.body;
    await insertProducts(products);
    res.status(200).json({ message: "Success." });
  } catch (error) {
    res.status(500).json(error);
  }
});


app.get("/list-products", async (req, res) => {
  try {
    const { data } = await axios.get("http://52.207.80.121:6000/list-products");
    const cache = data && data.products.length > 0;

    if (cache) {
      res.status(200).json({ products: data.products, cache });
    } else {
      dbClient.query("SELECT * FROM products", (err, products) => {
        if (err) throw err;
        axios.post("http://52.207.80.121:6000/store-products", { products });
        res.status(200).json({ products, cache: false });
      });
    }
  } catch (error) {
    console.error("Failed to retrieve from cache:", error.message);
    res.status(500).send("Error fetching products");
  }
});

const PORT = 6000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await dbClient.query("TRUNCATE TABLE products");
  } catch (error) {
    console.error(error);
  }
});
