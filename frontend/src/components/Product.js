import axios from '../api/axiosInstance';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';

import Rating from './Rating';
import { Store } from '../Store';

const Product = (props) => {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 300ms ease-in-out',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: 'var(--shadow-xl)',
          transform: 'translateY(-8px)',
        },
      }}
      className="product-card"
    >
      <CardMedia
        component={Link}
        to={`/product/${product.slug}`}
        sx={{
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden',
          height: '250px',
          backgroundColor: '#f5f5f5',
          '&:hover img': {
            transform: 'scale(1.15) rotate(2deg)',
          },
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 300ms ease-in-out',
          }}
        />
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', pb: 1 }}>
        <Typography
          component={Link}
          to={`/product/${product.slug}`}
          variant="h6"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            transition: 'color 300ms ease-in-out',
            '&:hover': {
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 700,
            },
            fontWeight: 600,
            minHeight: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {product.name}
        </Typography>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Typography
          variant="h6"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '1.25rem',
            mt: 1,
            animation: 'slideUp 0.3s ease-in-out',
          }}
        >
          ₹{product.price}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <span
            className={product.countInStock === 0 ? 'product-stock out-of-stock' : 'product-stock in-stock'}
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {product.countInStock === 0 ? 'Out of Stock' : `${product.countInStock} In Stock`}
          </span>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        {product.countInStock === 0 ? (
          <Button
            variant="outlined"
            disabled
            sx={{
              borderRadius: '8px',
              transition: 'all 300ms ease-in-out',
            }}
          >
            Out of stock
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => addToCartHandler(product)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              transition: 'all 300ms ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
              },
            }}
          >
            Add to cart
          </Button>
        )}
      </CardActions>
    </Card >
  );
};
export default Product;
