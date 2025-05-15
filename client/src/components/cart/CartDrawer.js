import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Stack,
  TextField,
} from '@mui/material';
import { Close, Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CartDrawer = ({ open, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    onClose();
    navigate('/checkout');
  };

  if (!cart?.items?.length) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, p: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6">Shopping Cart</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50vh',
            }}
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onClose();
                navigate('/shop');
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6">Shopping Cart ({cart.items.length} items)</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
        <List>
          {cart.items.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                
            <Box
            component="img"
            src={
              item.image.startsWith('http')
                ? item.image
                : `http://localhost:5000/uploads/${item.image}`
            }
            alt={item.name}
            sx={{ width: 60, height: 60, mr: 2, objectFit: 'cover' }}
          />

                <ListItemText
                  primary={item.name}
                  secondary={`$${Number(item.price) ? Number(item.price).toFixed(2) : '0.00'}`}

                />
                <ListItemSecondaryAction>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    <TextField
                      size="small"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          updateQuantity(item.id, value);
                        }
                      }}
                      inputProps={{
                        min: 1,
                        style: { textAlign: 'center', width: '40px' },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Add />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removeFromCart(item.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Total: ${cart.total.toFixed(2)}
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCheckout}
            >
              Checkout
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
