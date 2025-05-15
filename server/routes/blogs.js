// backend/routes/blogs.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/db'); // make sure this is a promisified query function

// GET all blogs
router.get('/', async (req, res) => {
  const sql = 'SELECT * FROM blogs ORDER BY created_at DESC';
  try {
    const results = await query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new blog
router.post('/', async (req, res) => {
  const { title, description, author, image_url } = req.body;
  if (!title || !description || !author || !image_url) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    INSERT INTO blogs (title, description, author, image_url, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  try {
    await query(sql, [title, description, author, image_url]);
    res.status(201).json({ message: 'Blog added successfully' });
  } catch (err) {
    console.error('Error inserting blog:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
