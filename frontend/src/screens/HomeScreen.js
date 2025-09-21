import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Cal1 from '../assets/cal1.webp';
import Cal2 from '../assets/cal2.webp';
import Cal3 from '../assets/cal3.webp';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <Box>
      <Helmet>
        <title>Vipulzone</title>
      </Helmet>
      
      <Box sx={{ mb: 4 }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          style={{ height: '30rem' }}
        >
          <SwiperSlide>
            <Box sx={{ position: 'relative', height: '100%' }}>
              <img
                src={Cal1}
                alt="First slide"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                <Typography variant="h4">First slide label</Typography>
                <Typography variant="body1">
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </Typography>
              </Box>
            </Box>
          </SwiperSlide>
          <SwiperSlide>
            <Box sx={{ position: 'relative', height: '100%' }}>
              <img
                src={Cal2}
                alt="Second slide"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                <Typography variant="h4">Second slide label</Typography>
                <Typography variant="body1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </Box>
            </Box>
          </SwiperSlide>
          <SwiperSlide>
            <Box sx={{ position: 'relative', height: '100%' }}>
              <img
                src={Cal3}
                alt="Third slide"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                <Typography variant="h4">Third slide label</Typography>
                <Typography variant="body1">
                  Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                </Typography>
              </Box>
            </Box>
          </SwiperSlide>
        </Swiper>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <Typography variant="h3" component="h1">
          __NEW ARRIVAL__
        </Typography>
      </Box>

      <Box>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.slug} xs={12} sm={6} md={4} lg={3}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
export default HomeScreen;
