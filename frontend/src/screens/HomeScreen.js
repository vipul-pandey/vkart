import { useEffect, useReducer, useState, useRef, useCallback } from 'react';
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
import ProductSkeleton from '../components/ProductSkeleton';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload || [], loading: false };
    case 'FETCH_MORE_REQUEST':
      return { ...state, loadingMore: true };
    case 'FETCH_MORE_SUCCESS':
      // Append new products to existing list
      return {
        ...state,
        products: [...state.products, ...action.payload],
        loadingMore: false
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_MORE_FAIL':
      return { ...state, loadingMore: false };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, products, loadingMore }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
    loadingMore: false,
  });
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannersError, setBannersError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const observerTarget = useRef(null);

  // Fetch initial products
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products?page=1&pageSize=12');
        const productsData = result.data?.products || result.data || [];
        setCurrentPage(1);
        setTotalPages(result.data?.pages || 1);
        dispatch({ type: 'FETCH_SUCCESS', payload: Array.isArray(productsData) ? productsData : [] });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  // Fetch more products (next page)
  const fetchMoreProducts = useCallback(async () => {
    if (currentPage >= totalPages || loadingMore) return; // Already at last page or loading

    dispatch({ type: 'FETCH_MORE_REQUEST' });
    try {
      const nextPage = currentPage + 1;
      const result = await axios.get(`/api/products?page=${nextPage}&pageSize=12`);
      const productsData = result.data?.products || [];
      setCurrentPage(nextPage);
      dispatch({ type: 'FETCH_MORE_SUCCESS', payload: Array.isArray(productsData) ? productsData : [] });
    } catch (err) {
      console.error('Error fetching more products:', err);
      dispatch({ type: 'FETCH_MORE_FAIL' });
    }
  }, [currentPage, totalPages, loadingMore]);

  // Setup Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && currentPage < totalPages) {
          fetchMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [currentPage, totalPages, loadingMore, fetchMoreProducts]);

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
        <title>Vkart - Modern Ecommerce</title>
      </Helmet>

      <Box sx={{ mb: 4, animation: 'fadeIn 0.5s ease-in-out' }}>
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
                  <Box
                    sx={{
                      position: 'relative',
                      width: '30rem',
                      height: '30rem',
                      animation: 'fadeIn 0.5s ease-in-out',
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={banner.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 300ms ease-in-out',
                      }}
                    />
                    <Box
                      borderRadius='0 15px'
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        color: banner.label?.color || 'white',
                        background:
                          'linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        animation: 'slideInLeft 0.5s ease-in-out',
                      }}
                      className="blink-animation"
                    >
                      <Typography
                        variant="h7"
                        sx={{
                          p: 2,
                          fontWeight: 'bold',
                          transition: 'all 300ms ease-in-out',
                        }}
                      >
                        {banner.label?.text}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        width: '100%',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        animation: 'slideInUp 0.5s ease-in-out 0.2s forwards',
                        opacity: 0,
                      }}
                    >
                      <Typography
                        variant="h4"
                        className='carousel-item-heading'
                        sx={{
                          color: 'white',
                          textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                        }}
                      >
                        {banner.title}
                      </Typography>
                    </Box>
                  </Box>
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          justifyContent: 'center',
          my: 5,
          py: 3,
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeInUp 0.6s ease-in-out',
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          ✨ New Arrivals ✨
        </Typography>
      </Box>

      <Box sx={{ animation: 'fadeInUp 0.6s ease-in-out 0.1s forwards', opacity: 0 }}>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Grid container spacing={3}>
              {products.map((product, index) => (
                <Grid
                  item
                  key={product.slug}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{
                    animation: 'staggerFadeIn 0.5s ease-in-out forwards',
                    animationDelay: `${index * 0.08}s`,
                    opacity: 0,
                  }}
                >
                  <Product product={product} />
                </Grid>
              ))}
            </Grid>

            {/* Infinite scroll trigger */}
            <Box ref={observerTarget} sx={{ py: 4 }}>
              {loadingMore && (
                <Grid container spacing={3}>
                  {[...Array(12)].map((_, i) => (
                    <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
                      <ProductSkeleton />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
export default HomeScreen;
