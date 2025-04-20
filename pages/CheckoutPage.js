import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import userService from '../services/userService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    const fetchShippingDetails = async () => {
      try {
        const data = await userService.getShippingDetails();
        if (data) {
          setShippingDetails(data);
        }
      } catch (error) {
        console.error('Error fetching shipping details:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchShippingDetails();
  }, []);

  const handleChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate cart
      if (!cart?.items?.length) {
        throw new Error('Your cart is empty');
      }

      // Save shipping details for future use
      await userService.updateProfile({ shippingDetails });

      // Prepare order data
      const orderData = {
        items: cart.items,
        shippingDetails,
      };

      // Place order
      await orderService.placeOrder(orderData, navigate);
      clearCart();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cart?.items?.length) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/shop')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Shipping Details Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Shipping Details
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={shippingDetails.fullName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={shippingDetails.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="State"
                    name="state"
                    value={shippingDetails.state}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="ZIP Code"
                    name="zipCode"
                    value={shippingDetails.zipCode}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Place Order'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <List>
              {cart.items.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              <ListItem>
                <ListItemText primary="Total" />
                <Typography variant="h6">
                  ${cart.total.toFixed(2)}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
