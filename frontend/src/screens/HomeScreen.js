import { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Typography,
  Box
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import axios from '../api/axiosInstance';
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
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannersError, setBannersError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannersLoading(true);
        setBannersError('');
        const { data } = await axios.get('/api/banners');
        setBanners(data.banners || []);
        setBannersLoading(false);
      } catch (err) {
        setBannersError(err.message || 'Failed to load banners');
        setBannersLoading(false);
      }
    };
    fetchBanners();
  }, []);
  return (
    <Box>
      <Helmet>
        <title>Vkart</title>
      </Helmet>

      <Box sx={{ mb: 4 }}>
        {bannersLoading ? (
          <LoadingBox />
        ) : bannersError ? (
          <MessageBox variant="danger">{bannersError}</MessageBox>
        ) : banners.length === 0 ? (
          <MessageBox variant="danger">No banners found</MessageBox>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            slidesPerView="auto"
            spaceBetween={20}
            style={{ height: '30rem' }}
          >
            {banners.map((banner, index) => {
              const imgSrc = banner.image || (banner.images && banner.images[0]);
              return (
                <SwiperSlide key={banner._id || index} style={{ width: '30rem' }}>
                  <Box sx={{ position: 'relative', width: '30rem', height: '30rem' }}>
                    <img
                      src={imgSrc}
                      alt={banner.title}
                      style={{ width: '100%', height: '100%' }}
                    />
                    <Box borderRadius='0 15px' sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      color: banner.label?.color || 'white',
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
                      textShadow: '2px 2px 4px rgba(231, 9, 9, 0.5)',
                    }}
                      className="blink-animation">
                      <Typography variant="h7" sx={{ p: 2, fontWeight: 'bold' }}>{banner.label?.text}</Typography>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        width: '100%',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      <Typography variant="h4" className='carousel-item-heading'>{banner.title}</Typography>
                    </Box>
                  </Box>
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}
      </Box>

      <Box sx={{ display: 'flex', backgroundColor: "primary.bgColor", justifyContent: 'center', my: 5, py: 3 }}>
        <Typography variant="h4" component="h2" fontWeight={'bold'} className="fade-left-right">
          New Arrivals
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
