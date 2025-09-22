import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';

import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import routes from './routes';
import theme from './theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box display={'flex'} flexDirection={'column'} minHeight={'100vh'}>
          <ToastContainer position="bottom-center" limit={1} />
          <Header />
          <Box style={{ flex: 1 }}>
            <Container maxWidth="xl" sx={{ mt: 10 }}>
              <Routes>
                {routes?.map((route) => {
                  if (route.private)
                    return (
                      <Route
                        path={route.path}
                        key={route.path}
                        element={<ProtectedRoute {...route} />}
                      />
                    );
                  else if (route.adminOnly)
                    return (
                      <Route
                        path={route.path}
                        key={route.path}
                        element={<AdminRoute {...route} />}
                      />
                    );
                  else
                    return (
                      <Route
                        path={route.path}
                        key={route.path}
                        element={<route.component />}
                      />
                    );
                })}
              </Routes>
            </Container>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
