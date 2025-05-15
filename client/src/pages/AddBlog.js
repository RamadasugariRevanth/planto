import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Typography } from '@mui/material';
import axios from 'axios';

const AddBlog = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    author: '',
    image_url: ''
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const maxDescriptionLength = 150; // Set the maximum number of characters for the preview

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/blogs', form);
      setSnackbarMessage('Blog added successfully!');
      setOpenSnackbar(true);
      setForm({ title: '', description: '', author: '', image_url: '' });
    } catch (error) {
      setSnackbarMessage('Failed to add blog');
      setOpenSnackbar(true);
      console.error(error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const displayDescription = showFullDescription
    ? form.description
    : form.description.slice(0, maxDescriptionLength);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Title" name="title" value={form.title} onChange={handleChange} />
      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={4}
      />
      <TextField label="Author" name="author" value={form.author} onChange={handleChange} />
      <TextField label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} />
      <Button variant="contained" onClick={handleSubmit}>Add Blog</Button>

      {/* Show truncated description with "Read More" */}
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        {displayDescription}
        {form.description.length > maxDescriptionLength && (
          <span
            onClick={toggleDescription}
            style={{
              color: 'blue',
              cursor: 'pointer',
              marginLeft: '5px',
              textDecoration: 'underline',
            }}
          >
            {showFullDescription ? ' Show less' : '... Read more'}
          </span>
        )}
      </Typography>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default AddBlog;
