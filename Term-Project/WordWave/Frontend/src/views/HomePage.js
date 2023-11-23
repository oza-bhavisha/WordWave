import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import './NavBar';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('https://your-backend-api/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div className="homepage">
      <h1 className="page-title">Latest Blog Posts</h1>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="post-preview">
            <h2 className="post-title">
              <Link to={`/post/${post.id}`} className="post-link">
                {post.title}
              </Link>
            </h2>
            <p className="post-summary">{post.summary}</p>
          </div>
        ))
      ) : (
        <p className="no-posts">No posts available.</p>
      )}
    </div>
  );
};

export default HomePage;
