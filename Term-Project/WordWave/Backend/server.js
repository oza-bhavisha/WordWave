const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();
const port = process.env.PORT || 4000;

// Configure AWS
AWS.config.update({
  region: 'us-east-1', 
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    sessionToken: process.env.sessionToken,
});

// Create DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors());

// Define a route to create a new post
app.post('/posts', async (req, res) => {
  const { blog_id, title, content } = req.body;
  if (!blog_id || !title || !content) {
    return res.status(400).json({ error: 'blog id, title, and content are required.' });
  }

  const params = {
    TableName: 'blogs',
    Item: {
      blog_id, 
      title, 
      content
    }
  };

  try {
    await docClient.put(params).promise();
    res.status(201).json(params.Item);
  } catch (err) {
    res.status(500).json({ error: 'Could not create post: ' + err.message });
  }
});

// Define a route to get a post by blog_id
app.get('/posts/:id', async (req, res) => {
  const blog_id = req.params.id;

  const params = {
    TableName: 'blogs',
    Key: {
      blog_id
    }
  };

  try {
    const data = await docClient.get(params).promise();
    if (data.Item) {
      res.status(200).json(data.Item);
    } else {
      res.status(404).json({ error: 'Post not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve post: ' + err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
