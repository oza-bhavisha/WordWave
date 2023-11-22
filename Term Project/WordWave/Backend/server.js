const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create express app
const app = express();

// Use middlewares
app.use(bodyParser.json());
app.use(cors());

// Mock data - In a real app, this will be replaced with a database
let posts = [
    { id: 1, title: 'First Post', content: 'This is the first post', summary: 'First Post Summary' },
    // Add more sample posts here
];

// Endpoint to get all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// Endpoint to get a single post by id
app.get('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        res.json(post);
    } else {
        res.status(404).send('Post not found');
    }
});

// Endpoint to create a new post
app.post('/posts', (req, res) => {
    const { title, content, summary } = req.body;
    const newPost = {
        id: posts.length + 1, // This is a simple way to generate unique IDs for this example
        title,
        content,
        summary
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
