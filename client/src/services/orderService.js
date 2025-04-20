import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const orderService = {
  placeOrder: async (orderData, navigate) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Navigate to success page with order ID
      if (navigate) {
        navigate('/order-success', { 
          state: { orderId: response.data.orderId }
        });
      }

      return response.data;
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      throw error;
    }
  },

  getMyOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      throw error;
    }
  },

  getOrderDetails: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default orderService;
