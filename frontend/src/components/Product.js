import axios from 'axios';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component={Link}
        to={`/product/${product.slug}`}
        sx={{ textDecoration: 'none' }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '400px', objectFit: 'cover' }}
        />
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Typography
          component={Link}
          to={`/product/${product.slug}`}
          variant="h6"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          {product.name}
        </Typography>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Typography variant="h6" color="primary">
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        {product.countInStock === 0 ? (
          <Button variant="outlined" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => addToCartHandler(product)}
          >
            Add to cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
export default Product;
