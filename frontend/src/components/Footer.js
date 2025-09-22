import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#272723',
        color: '#FFFFFF',
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="body2" color="inherit" align="center">
          All rights reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
