import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Chip,
  TextField,
  Tabs,
  Tab,
  Paper,
  Snackbar,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Park,
  Pets,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: '20px' }}>
    {value === index && <Box>{children}</Box>}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '/placeholder.jpg',
      quantity: quantity,
    });
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;
  if (error) return <Box sx={{ p: 4 }}>{error}</Box>;
  if (!product) return <Box sx={{ p: 4 }}>Product not found</Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/shop" color="inherit">
          Shop
        </MuiLink>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: '400px',
              backgroundImage: `url(${product.image_url || '/placeholder.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating || 0} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.reviewCount || 0} reviews)
            </Typography>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.stock }}
                  sx={{ width: '100px' }}
                />
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  {product.stock} in stock
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock < 1}
            >
              Add to Cart
            </Button>
            <IconButton
              color="primary"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Box>

          {/* Features */}
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShipping />
                  <Typography variant="body2">Free Shipping</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Park />
                  <Typography variant="body2">Plant Care Guide</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Description" />
          <Tab label="Details" />
          <Tab label="Care Instructions" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Typography>{product.description}</Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {product.details && (
            <Grid container spacing={2}>
              {Object.entries(product.details).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                  <Typography>{value}</Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {product.care && (
            <ul>
              {product.care.map((instruction, index) => (
                <li key={index}>
                  <Typography paragraph>{instruction}</Typography>
                </li>
              ))}
            </ul>
          )}
        </TabPanel>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Product added to cart!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetails;
