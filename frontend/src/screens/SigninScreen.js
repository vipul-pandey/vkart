import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Paper,
} from '@mui/material';

import { Store } from '../Store';
import { getError } from '../utils';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={submitHandler} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              New customer?{' '}
              <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              Forget Password? <Link to={`/forget-password`}>Reset Password</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
