import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetails from './components/products/ProductDetails';
import CheckoutPage from './pages/CheckoutPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MyOrders from './pages/MyOrders';
import OrderSuccess from './pages/OrderSuccess';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Create theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#795548',
      light: '#a98274',
      dark: '#4b2c20',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />

              <Route path="/order-success" element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/*" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
