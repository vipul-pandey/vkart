import React from 'react';
import { Grid, Typography, Box } from '@mui/material';

const CheckoutSteps = (props) => {
  return (
    <Box className="checkout-steps" sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography 
            variant="body1" 
            className={props.step1 ? 'active' : ''}
            sx={{ 
              textAlign: 'center',
              pb: 1,
              borderBottom: props.step1 ? '2px solid #f0c040' : '2px solid #a0a0a0',
              color: props.step1 ? '#f0c040' : '#a0a0a0'
            }}
          >
            Sign-In
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography 
            variant="body1" 
            className={props.step2 ? 'active' : ''}
            sx={{ 
              textAlign: 'center',
              pb: 1,
              borderBottom: props.step2 ? '2px solid #f0c040' : '2px solid #a0a0a0',
              color: props.step2 ? '#f0c040' : '#a0a0a0'
            }}
          >
            Shipping
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography 
            variant="body1" 
            className={props.step3 ? 'active' : ''}
            sx={{ 
              textAlign: 'center',
              pb: 1,
              borderBottom: props.step3 ? '2px solid #f0c040' : '2px solid #a0a0a0',
              color: props.step3 ? '#f0c040' : '#a0a0a0'
            }}
          >
            Payment
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography 
            variant="body1" 
            className={props.step4 ? 'active' : ''}
            sx={{ 
              textAlign: 'center',
              pb: 1,
              borderBottom: props.step4 ? '2px solid #f0c040' : '2px solid #a0a0a0',
              color: props.step4 ? '#f0c040' : '#a0a0a0'
            }}
          >
            Place Order
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutSteps;
