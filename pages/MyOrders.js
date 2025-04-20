import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';

const getStatusColor = (status) => {
  if (!status) return 'default'; // Return 'default' if status is undefined or null
  
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const orderDetails = await orderService.getOrderDetails(orderId);
      setSelectedOrder(orderDetails);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't placed any orders yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/shop')}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${order.total_amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.payment_status}
                      color={getStatusColor(order.payment_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order Details #{selectedOrder.id}
              <Typography variant="subtitle2" color="text.secondary">
                Placed on{' '}
                {new Date(selectedOrder.created_at).toLocaleDateString()}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Items
                </Typography>
                <List>
                  {selectedOrder.items.map((item) => (
                    <React.Fragment key={item.id}>

                      <ListItem>
                        <ListItemText
                          primary={item.name}
                          secondary={`Quantity: ${item.quantity} × $${parseFloat(item.price).toFixed(2)}`}
                        />
                        <Typography variant="h6">
  ${isNaN(parseFloat(item.total_amount)) 
    ? 'Invalid Amount' 
    : parseFloat(item.total_amount).toFixed(2)}
</Typography>

                      </ListItem>


                      <Divider />
                    </React.Fragment>
                  ))}
                  <ListItem>
                    <ListItemText primary="Total Amount" />
                    <Typography variant="h6">
  ${isNaN(parseFloat(selectedOrder.total_amount)) 
    ? 'Invalid Amount' 
    : parseFloat(selectedOrder.total_amount).toFixed(2)}
</Typography>

                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography>
                  {selectedOrder.shipping_address.firstName}{' '}
                  {selectedOrder.shipping_address.lastName}
                </Typography>
                <Typography>{selectedOrder.shipping_address.address}</Typography>
                <Typography>
                  {selectedOrder.shipping_address.city},{' '}
                  {selectedOrder.shipping_address.state}{' '}
                  {selectedOrder.shipping_address.zipCode}
                </Typography>
                <Typography>{selectedOrder.shipping_address.phone}</Typography>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Order Tracking
                </Typography>
                <List>
                  {selectedOrder.tracking.map((track, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={track.status}
                        secondary={
                          <>
                            {track.description}
                            <br />
                            {new Date(track.created_at).toLocaleString()}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MyOrders;
