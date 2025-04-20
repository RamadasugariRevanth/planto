import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
  Rating,
  Snackbar,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const TopProducts = ({ showTitle = true, maxItems = 4 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Mock data - will be replaced with API call
  const [products] = useState([
    {
      id: 1,
      name: 'Snake Plant',
      price: 29.99,
      image: 'https://source.unsplash.com/400x400/?snake-plant',
      rating: 4.5,
      category: 'indoor',
    },
    {
      id: 2,
      name: 'Peace Lily',
      price: 24.99,
      image: 'https://source.unsplash.com/400x400/?peace-lily',
      rating: 4.8,
      category: 'indoor',
    },
    {
      id: 3,
      name: 'Monstera',
      price: 39.99,
      image: 'https://source.unsplash.com/400x400/?monstera',
      rating: 4.7,
      category: 'indoor',
    },
    {
      id: 4,
      name: 'Fiddle Leaf Fig',
      price: 49.99,
      image: 'https://source.unsplash.com/400x400/?fiddle-leaf-fig',
      rating: 4.6,
      category: 'indoor',
    },
    {
      id: 5,
      name: 'Succulent Collection',
      price: 34.99,
      image: 'https://source.unsplash.com/400x400/?succulent',
      rating: 4.9,
      category: 'succulents',
    },
    {
      id: 6,
      name: 'Bamboo Palm',
      price: 44.99,
      image: 'https://source.unsplash.com/400x400/?bamboo-palm',
      rating: 4.4,
      category: 'indoor',
    },
    {
      id: 7,
      name: 'Garden Tool Set',
      price: 59.99,
      image: 'https://source.unsplash.com/400x400/?garden-tools',
      rating: 4.8,
      category: 'supplies',
    },
    {
      id: 8,
      name: 'Rose Bush',
      price: 29.99,
      image: 'https://source.unsplash.com/400x400/?rose-plant',
      rating: 4.7,
      category: 'outdoor',
    },
  ]);

  const displayedProducts = maxItems ? products.slice(0, maxItems) : products;

  const handleProductClick = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ py: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {showTitle && (
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ textAlign: 'center', mb: 4 }}
          >
            Top-Selling Products
          </Typography>
        )}
        <Grid container spacing={3}>
          {displayedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    cursor: 'pointer',
                  },
                }}
                onClick={() => handleProductClick(product.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    ${product.price}
                  </Typography>
                  <Rating
                    value={product.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCart />}
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Product added to cart"
      />
    </Box>
  );
};

export default TopProducts;
