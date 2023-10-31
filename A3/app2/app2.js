import express from "express";
import redis from "redis";
import morgan from "morgan";


const app = express();
app.use(express.json());
app.use(morgan("combined"));

const PORT = 6000;
const redisPort = 6379;
const redisClient = redis.createClient(redisPort);

app.use(bodyParser.json());
app.use(morgan('combined'));

app.post('/store-products', async (req, res) => {
  const { products } = req.body;
  
  if (!products) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  redisClient.set('products', JSON.stringify(products), (error, reply) => {
    if (error) {
        console.log(error)
    throw error;
    }
    return res.status(200).json({ message: 'Success.' });
  });
});

app.get('/list-products', async (req, res) => {
  redisClient.get('products', (error, data) => {
    if (error) {
      console.error(error);
      throw wrror 
    }
    const products = data ? JSON.parse(data) : [];
    return res.status(200).json({ products });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
