import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  LocalFlorist as ProductsIcon,
} from '@mui/icons-material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddProduct from '../../components/admin/AddProduct';
import axios from 'axios'; // 🛠️ We use axios for API calls
import AddBlog from '../AddBlog';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ width: '100%' }}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [totalProducts, setTotalProducts] = useState(null); // 🆕 state for products
  const [totalOrders, setTotalOrders] = useState(null); // 🆕 state for orders
  const [activeUsers, setActiveUsers] = useState(null); // 🆕 state for active users
  const [loading, setLoading] = useState(true); // 🆕 loader

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/admin');
        break;
      case 1:
        navigate('/admin/products');
        break;
      case 2:
        navigate('/admin/orders');
        break;
      case 3:
        navigate('/admin/users');
        break;
      case 4:
        navigate('/admin/blogs');
        break;
      default:
        navigate('/admin');
    }
  };
  




  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const productsRes = await axios.get('http://localhost:5000/api/productstotal');
        console.log('Products response:', productsRes.data);
        setTotalProducts(productsRes.data.total);
  
        const ordersRes = await axios.get('http://localhost:5000/api/orders');
        console.log('Orders response:', ordersRes.data);
        setTotalOrders(ordersRes.data.total);
  
        const usersRes = await axios.get('http://localhost:5000/api/totalusers');
        console.log('Users response:', usersRes.data);
        setActiveUsers(usersRes.data.total);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
  
    fetchCounts();
  }, []);

  

  const statCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <ProductsIcon />,
      color: '#2e7d32',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <OrdersIcon />,
      color: '#1976d2',
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: <UsersIcon />,
      color: '#ed6c02',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
          </Grid>

          {/* Tabs */}
          <Grid item xs={12}>
            <Paper sx={{ width: '100%' }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab icon={<DashboardIcon />} label="Dashboard" iconPosition="start" />
                <Tab icon={<ProductsIcon />} label="Products" iconPosition="start" />
                <Tab icon={<OrdersIcon />} label="Orders" iconPosition="start" />
                <Tab icon={<UsersIcon />} label="Users" iconPosition="start" />
                <Tab icon={<ProductsIcon />} label="Blogs" iconPosition="start" />
              </Tabs>
            </Paper>
          </Grid>

          {/* Content */}
          <Grid item xs={12}>
          <Routes>
  <Route
    path="/"
    element={
      loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="h4">
                        {stat.value !== null ? stat.value : '-'}
                      </Typography>
                    </Box>
                    <IconButton
                      sx={{
                        backgroundColor: stat.color + '20',
                        color: stat.color,
                        '&:hover': {
                          backgroundColor: stat.color + '30',
                        },
                      }}
                    >
                      {stat.icon}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )
    }
  />
  <Route
    path="/products"
    element={
      <Box>
        <Typography variant="h5" gutterBottom>
          Product Management
        </Typography>
        <AddProduct onProductAdded={() => {}} />
      </Box>
    }
  />
  <Route path="/orders" element={<Typography variant="h5">Order Management</Typography>} />
  <Route path="/users" element={<Typography variant="h5">User Management</Typography>} />
  <Route path="/blogs" element={<AddBlog />} />

</Routes>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
