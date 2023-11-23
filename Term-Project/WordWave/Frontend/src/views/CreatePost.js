import React, { useState } from 'react';
import './CreatePost.css';
import './NavBar';
import './HomePage';
import './BlogPost';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const postData = { title, content };

    fetch('http://localhost:4000/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setIsSubmitting(false);
      })
      .catch(error => {
        console.error('Error posting:', error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="create-post-container">
      <h2 className="form-title">Create a New Blog Post</h2>
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
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
