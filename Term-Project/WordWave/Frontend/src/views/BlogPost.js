import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BlogPost.css';
import './NavBar';

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/posts/${id}`)
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  return post ? (
    <div className="blog-post">
      <h1 className="blog-title">{post.title}</h1>
      <img src={post.imageUrl} alt={post.title} className="blog-image" /> {/* Example if posts have images */}
      <p className="blog-content">{post.content}</p>
    </div>
  ) : (
    <div className="loading">Loading...</div>
  );
};

export default BlogPost;
