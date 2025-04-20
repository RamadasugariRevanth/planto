import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';
import axios from 'axios';

const AddProduct = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem('token'); // Retrieve token from storage


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await axios.post('/api/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
      });
      clearImage();
      if (onProductAdded) {
        onProductAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Product added successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Image Upload */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {imagePreview ? (
                <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'background.paper',
                    }}
                    onClick={clearImage}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  sx={{ width: 200, height: 200 }}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              )}
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
              >
                <MenuItem value="indoor">Indoor Plants</MenuItem>
                <MenuItem value="outdoor">Outdoor Plants</MenuItem>
                <MenuItem value="succulents">Succulents</MenuItem>
                <MenuItem value="tools">Gardening Tools</MenuItem>
                <MenuItem value="pots">Pots & Planters</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              required
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddProduct;
