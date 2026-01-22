import React, { useState, useContext, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  AccountCircle,
} from '@mui/icons-material';

import logo from '../assets/vkart-logo.png';
import SearchBox from './SearchBox';
import { Store } from '../Store';
import { getError } from '../utils';
const _ = require('lodash');

const Header = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    setAnchorEl(null);
    navigate('/signin');
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdminMenuOpen = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
    setAnchorEl(null);
  };
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {searchOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 56, sm: 64 },
            left: 0,
            width: '100vw',
            height: `calc(100vh - 56px)`,
            // For sm and up, adjust height for taller AppBar
            '@media (min-width:600px)': {
              height: 'calc(100vh - 64px)',
            },
            zIndex: 2000,
            display: { xs: 'flex', md: 'none' },
            alignItems: 'flex-start',
            justifyContent: 'center',
            pointerEvents: 'auto',
            background: 'transparent',
          }}
          onClick={() => setSearchOpen(false)}
        >
          <Box
            sx={{
              width: '94%',
              maxWidth: 500,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              mt: 2,
              p: 1.5,
            }}
            onClick={e => e.stopPropagation()}
          >
            <SearchBox />
          </Box>
        </Box>
      )}
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: { xs: 56, sm: 64, padding: 0 } }}>
            {/* Left: Hamburger and Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexzz: { xs: '1 1 auto', md: '0 1 auto' } }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                sx={{ mr: { xs: 0, md: 2 } }}
              >
                <MenuIcon />
              </IconButton>
              <Box
                component={Link}
                to="/"
                sx={{ display: 'flex', alignItems: 'center' }}
                onClick={() => setSearchOpen(false)}
              >
                <img src={logo} width='100px' alt="logo" />
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'end' }}>
              <IconButton
                color="inherit"
                sx={{ display: { xs: 'flex', md: 'none' } }}
                onClick={() => setSearchOpen(true)}
                aria-label="open search"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99a1 1 0 0 0 1.41-1.41l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="currentColor" /></svg>
              </IconButton>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', maxWidth: 400 }}>
                <SearchBox />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: { xs: '1 1 auto', md: '0 1 auto' } }}>
              <IconButton
                component={Link}
                to="/cart"
                color="inherit"
                sx={{ mr: 1 }}
              >
                <Badge
                  badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  color="error"
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {userInfo ? (
                <>
                  <Button
                    color="inherit"
                    onClick={handleUserMenuOpen}
                    startIcon={<AccountCircle />}
                    sx={{ minWidth: 0, px: 1 }}
                  >
                    <Box
                      sx={{
                        display: { xs: 'none', sm: 'inline' },
                        textTransform: 'none',
                      }}
                    >
                      {userInfo.name}
                    </Box>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleUserMenuClose}
                    >
                      User Profile
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/orderhistory"
                      onClick={handleUserMenuClose}
                    >
                      History
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        component={Link}
                        onClick={handleAdminMenuOpen}
                      >
                        Admin
                      </MenuItem>
                    )}
                    <MenuItem onClick={signoutHandler}>Sign Out</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button component={Link} to="/signin" color="inherit">
                  Sign In
                </Button>
              )}
              <Menu
                anchorEl={adminAnchorEl}
                open={Boolean(adminAnchorEl)}
                onClose={handleAdminMenuClose}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  component={Link}
                  to="/admin/dashboard"
                  onClick={handleAdminMenuClose}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/admin/products"
                  onClick={handleAdminMenuClose}
                >
                  Products
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/admin/banners"
                  onClick={handleAdminMenuClose}
                >
                  Banners
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/admin/orders"
                  onClick={handleAdminMenuClose}
                >
                  Orders
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/admin/users"
                  onClick={handleAdminMenuClose}
                >
                  Users
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={sidebarIsOpen}
        onClose={() => setSidebarIsOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 240 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Categories
          </Typography>
          <List>
            {categories.map((category) => (
              <ListItem
                key={category}
                component={Link}
                to={`/search?category=${category}`}
                onClick={() => setSidebarIsOpen(false)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText primary={_.startCase(category)} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
