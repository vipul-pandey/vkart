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

import logo from '../assets/logo.png';
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
        console.log('fetching categories', axios);
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
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'black' }}>
        <Container maxWidth="xl">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', mr: 2 }}
            >
              <img src={logo} width="130px" alt="logo" />
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <SearchBox />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                component={Link}
                to="/cart"
                color="inherit"
                sx={{ mr: 2 }}
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
                  >
                    {userInfo.name}
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
                    <MenuItem onClick={signoutHandler}>Sign Out</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button component={Link} to="/signin" color="inherit">
                  Sign In
                </Button>
              )}

              {userInfo && userInfo.isAdmin && (
                <>
                  <Button color="inherit" onClick={handleAdminMenuOpen}>
                    Admin
                  </Button>
                  <Menu
                    anchorEl={adminAnchorEl}
                    open={Boolean(adminAnchorEl)}
                    onClose={handleAdminMenuClose}
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
                </>
              )}
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
