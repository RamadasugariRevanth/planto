// src/pages/BlogPage.jsx
import React, { useEffect, useState } from 'react';
import './BlogPage.css';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error('Error fetching blogs:', err));
  }, []);

  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1>Planto Blog</h1>
      </header>
      <main className="blog-container">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            {blog.image_url && (
              <img src={blog.image_url} alt="Blog cover" className="blog-image" />
            )}
            <h2 className="blog-title">{blog.title}</h2>
            <p className="blog-description">{blog.description}</p>
            <div className="blog-meta">
              <span>By {blog.author || 'Admin'}</span>
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default BlogPage;
