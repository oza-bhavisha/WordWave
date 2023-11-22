import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`https://your-backend-api/posts/${id}`)
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  return post ? (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default BlogPost;
