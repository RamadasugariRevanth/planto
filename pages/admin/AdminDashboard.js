import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  LocalFlorist as ProductsIcon,
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AddProduct from '../../components/admin/AddProduct';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ width: '100%' }}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);

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
      default:
        navigate('/admin');
    }
  };

  // Stats cards data
  const stats = [
    {
      title: 'Total Products',
      value: '120',
      icon: <ProductsIcon />,
      color: '#2e7d32',
    },
    {
      title: 'Total Orders',
      value: '45',
      icon: <OrdersIcon />,
      color: '#1976d2',
    },
    {
      title: 'Active Users',
      value: '89',
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
                <Tab
                  icon={<DashboardIcon />}
                  label="Dashboard"
                  iconPosition="start"
                />
                <Tab
                  icon={<ProductsIcon />}
                  label="Products"
                  iconPosition="start"
                />
                <Tab
                  icon={<OrdersIcon />}
                  label="Orders"
                  iconPosition="start"
                />
                <Tab
                  icon={<UsersIcon />}
                  label="Users"
                  iconPosition="start"
                />
              </Tabs>
            </Paper>
          </Grid>

          {/* Content */}
          <Grid item xs={12}>
            <Routes>
              <Route
                path="/"
                element={
                  <Grid container spacing={3}>
                    {stats.map((stat, index) => (
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
                                  {stat.value}
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
                }
              />
              <Route
                path="/products"
                element={
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Product Management
                    </Typography>
                    <AddProduct
                      onProductAdded={() => {
                        // Refresh product list
                      }}
                    />
                  </Box>
                }
              />
              <Route
                path="/orders"
                element={
                  <Typography variant="h5">Order Management</Typography>
                }
              />
              <Route
                path="/users"
                element={
                  <Typography variant="h5">User Management</Typography>
                }
              />
            </Routes>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
