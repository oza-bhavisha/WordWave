import React, { useState } from 'react';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const postData = { title, content };

    fetch('https://your-backend-api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error posting:', error));
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input 
            type="text" 
            id="title"
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea 
            id="content"
            value={content} 
            onChange={e => setContent(e.target.value)} 
            className="form-control"
          />
        </div>
        <button type="submit" className="submit-button">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
