import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Box, Container, Paper } from '@mui/material';

import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);
  const [country, setCountry] = useState(shippingAddress.country || '');
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location: shippingAddress.location,
      })
    );
    navigate('/payment');
  };

  useEffect(() => {
    ctxDispatch({ type: 'SET_FULLBOX_OFF' });
  }, [ctxDispatch, fullBox]);

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shipping Address
        </Typography>
        <Box component="form" onSubmit={submitHandler}>
          <TextField
            fullWidth
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            margin="normal"
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/map')}
              sx={{ mb: 1 }}
            >
              Choose Location On Map
            </Button>
            {shippingAddress.location && shippingAddress.location.lat ? (
              <Typography variant="body2">
                LAT: {shippingAddress.location.lat} LNG: {shippingAddress.location.lng}
              </Typography>
            ) : (
              <Typography variant="body2">No location</Typography>
            )}
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Continue
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
