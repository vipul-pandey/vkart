import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import axios from '../api/axiosInstance';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import {
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
} from '@mui/material';

import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  console.log('pruducs', product);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <img
            style={{ width: '100%', maxWidth: '100%' }}
            src={selectedImage || product.image}
            alt={product.name}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <List>
            <ListItem>
              <Box>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <Typography variant="h4" component="h1">
                  {product.name}
                </Typography>
              </Box>
            </ListItem>
            <ListItem>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              />
            </ListItem>
            <ListItem>
              <Typography variant="h6">Price: ₹{product.price}</Typography>
            </ListItem>
            <ListItem>
              <Grid container spacing={1}>
                {[product.image, ...product.images].map((x) => (
                  <Grid item xs={6} key={x}>
                    <Button
                      onClick={() => setSelectedImage(x)}
                      sx={{ p: 0, minWidth: 'auto' }}
                    >
                      <img
                        src={x}
                        alt="product"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                      />
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </ListItem>
            <ListItem>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Description:
                </Typography>
                <Typography variant="body1">{product.description}</Typography>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Price:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>₹{product.price}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Status:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {product.countInStock > 0 ? (
                        <Chip label="In Stock" color="success" size="small" />
                      ) : (
                        <Chip label="Unavailable" color="error" size="small" />
                      )}
                    </Grid>
                  </Grid>
                </ListItem>
                {product.countInStock > 0 && (
                  <ListItem>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </Button>
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" component="h2" ref={reviewsRef} gutterBottom>
          Reviews
        </Typography>
        {product.reviews.length === 0 && (
          <MessageBox>There is no review</MessageBox>
        )}
        <List>
          {product.reviews.map((review) => (
            <ListItem key={review._id} sx={{ border: 1, borderColor: 'grey.300', mb: 1, borderRadius: 1 }}>
              <Box>
                <Typography variant="h6">{review.name}</Typography>
                <Rating rating={review.rating} caption=" " />
                <Typography variant="body2" color="text.secondary">
                  {review?.createdAt?.substring(0, 10)}
                </Typography>
                <Typography variant="body1">{review.comment}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
        <Box sx={{ my: 3 }}>
          {userInfo ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Write a customer review
              </Typography>
              <Box component="form" onSubmit={submitHandler}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Rating</InputLabel>
                  <Select
                    value={rating}
                    label="Rating"
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="1">1- Poor</MenuItem>
                    <MenuItem value="2">2- Fair</MenuItem>
                    <MenuItem value="3">3- Good</MenuItem>
                    <MenuItem value="4">4- Very good</MenuItem>
                    <MenuItem value="5">5- Excellent</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comments"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  margin="normal"
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loadingCreateReview}
                  >
                    Submit
                  </Button>
                  {loadingCreateReview && <LoadingBox />}
                </Box>
              </Box>
            </Paper>
          ) : (
            <MessageBox>
              Please{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Sign In
              </Link>{' '}
              to write a review
            </MessageBox>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default ProductScreen;
