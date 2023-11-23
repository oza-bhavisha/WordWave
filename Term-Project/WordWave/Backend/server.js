// index.js

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors())


// Dummy array to store posts
const posts = [];

// Define a route to create a new post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const newPost = { title, content };
  posts.push(newPost);

  return res.status(201).json(newPost);
});

// Define a route to get all posts
app.get('/posts', (req, res) => {
  return res.status(200).json(posts);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
