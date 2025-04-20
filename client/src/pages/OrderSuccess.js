import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <CheckCircle
          sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your order. Your order ID is #{orderId}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          You will receive an email confirmation shortly.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/my-orders')}
          >
            View My Orders
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/shop')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderSuccess;
