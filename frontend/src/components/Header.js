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

import logo from '../assets/vkart-modern-logo.svg';
import SearchBox from './SearchBox';
import { Store } from '../Store';
import { getError } from '../utils';
import './Header.css';
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
    <Box className="header-container">
      {/* Mobile Search Overlay */}
      {searchOpen && (
        <Box
          className="header-search-overlay"
          onClick={() => setSearchOpen(false)}
        >
          <Box
            className="header-search-modal"
            onClick={e => e.stopPropagation()}
          >
            <SearchBox />
          </Box>
        </Box>
      )}

      {/* Header AppBar */}
      <AppBar position="fixed" className="header-appbar">
        <Container maxWidth="xl">
          <Toolbar className="header-toolbar">
            {/* Left: Hamburger and Logo */}
            <Box className="header-logo-section">
              <IconButton
                edge="start"
                className="header-hamburger"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <MenuIcon />
              </IconButton>
              <Box
                component={Link}
                to="/"
                className="header-logo-link"
                onClick={() => setSearchOpen(false)}
              >
                <img src={logo} alt="VKART Logo" className="header-logo-img" />
              </Box>
            </Box>

            {/* Center: Search */}
            <Box className="header-search-section">
              <IconButton
                className="header-search-mobile-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="open search"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99a1 1 0 0 0 1.41-1.41l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" fill="white" />
                </svg>
              </IconButton>
              <Box className="header-search-desktop">
                <SearchBox />
              </Box>
            </Box>

            {/* Right: Cart and User */}
            <Box className="header-right-section">
              <IconButton
                component={Link}
                to="/cart"
                className="header-cart-btn"
              >
                <Badge
                  badgeContent={cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: 'pulse 2s ease-in-out infinite',
                    },
                  }}
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
                    className="header-user-btn"
                  >
                    <Box className="header-user-name">
                      {userInfo.name}
                    </Box>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserMenuClose}
                    className="header-user-menu"
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
                <Button
                  component={Link}
                  to="/signin"
                  color="inherit"
                  className="header-signin-btn"
                >
                  Sign In
                </Button>
              )}
              <Menu
                anchorEl={adminAnchorEl}
                open={Boolean(adminAnchorEl)}
                onClose={handleAdminMenuClose}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                className="header-admin-menu"
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

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={sidebarIsOpen}
        onClose={() => setSidebarIsOpen(false)}
        className="header-drawer"
      >
        <Box className="header-categories-box">
          <Typography variant="h6" className="header-categories-title">
            Categories
          </Typography>
          <List className="header-categories-list">
            {categories.map((category, index) => (
              <ListItem
                key={category}
                component={Link}
                to={`/search?category=${category}`}
                onClick={() => setSidebarIsOpen(false)}
                className="header-category-item"
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
