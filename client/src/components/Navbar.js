import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './cart/CartDrawer';

const pages = [
  { title: 'Shop', path: '/shop' },
  { title: 'Book Gardener', path: '/book-gardener' },
  { title: 'Blog', path: '/blog' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  const toggleCart = () => setCartOpen(!cartOpen);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Desktop Logo */}
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                mr: 4,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 800,
                fontSize: '1.8rem',
                color: 'primary.main',
                textDecoration: 'none',
                letterSpacing: 1,
              }}
            >
              PLANTO 🌿
            </Typography>

            {/* Mobile Menu Icon */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.title}
                    component={RouterLink}
                    to={page.path}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile Logo */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              PLANTO
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {pages.map((page) => (
                <Button
                  key={page.title}
                  component={RouterLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 1,
                    color: 'text.primary',
                    fontWeight: 600,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            {/* Right Side Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Cart */}
              <IconButton onClick={toggleCart} color="inherit">
                <Badge badgeContent={cart?.items?.length || 0} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* User Section */}
              {isAuthenticated ? (
                <>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenUserMenu}>
                      <Avatar alt={user?.email} src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                      Profile
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/my-orders" onClick={handleCloseUserMenu}>
                      My Orders
                    </MenuItem>
                    {isAdmin && (
                      <MenuItem component={RouterLink} to="/admin" onClick={handleCloseUserMenu}>
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <CartDrawer open={cartOpen} onClose={toggleCart} />
    </>
  );
};

export default Navbar;
