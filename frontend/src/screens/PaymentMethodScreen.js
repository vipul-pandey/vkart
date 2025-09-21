import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Typography,
  Box,
  Container,
  Paper,
} from '@mui/material';

import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

const PaymentMethodScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <Container maxWidth="sm">
      <CheckoutSteps step1 step2 step3 />
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Method
        </Typography>
        <Box component="form" onSubmit={submitHandler}>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              value={paymentMethodName}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="PayPal"
                control={<Radio />}
                label="PayPal"
              />
              <FormControlLabel
                value="Stripe"
                control={<Radio />}
                label="Stripe"
              />
            </RadioGroup>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Continue
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
export default PaymentMethodScreen;
