import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Grid,
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  IconButton,
} from '@mui/material';
import { Clear } from '@mui/icons-material';

import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? '' : '/search?'
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <Container>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Department
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={getFilterUrl({ category: 'all' })}
                  selected={'all' === category}
                >
                  <ListItemText primary="Any" />
                </ListItemButton>
              </ListItem>
              {categories.map((c) => (
                <ListItem key={c} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={getFilterUrl({ category: c })}
                    selected={c === category}
                  >
                    <ListItemText primary={c} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Price
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={getFilterUrl({ price: 'all' })}
                  selected={'all' === price}
                >
                  <ListItemText primary="Any" />
                </ListItemButton>
              </ListItem>
              {prices.map((p) => (
                <ListItem key={p.value} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={getFilterUrl({ price: p.value })}
                    selected={p.value === price}
                  >
                    <ListItemText primary={p.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Avg. Customer Review
            </Typography>
            <List dense>
              {ratings.map((r) => (
                <ListItem key={r.name} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={getFilterUrl({ rating: r.rating })}
                    selected={`${r.rating}` === `${rating}`}
                  >
                    <Rating caption={' & up'} rating={r.rating} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={getFilterUrl({ rating: 'all' })}
                  selected={rating === 'all'}
                >
                  <Rating caption={' & up'} rating={0} />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="body1">
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <IconButton
                        size="small"
                        onClick={() => navigate('/search')}
                        sx={{ ml: 1 }}
                      >
                        <Clear />
                      </IconButton>
                    ) : null}
                  </Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={order}
                    label="Sort by"
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <MenuItem value="newest">Newest Arrivals</MenuItem>
                    <MenuItem value="lowest">Price: Low to High</MenuItem>
                    <MenuItem value="highest">Price: High to Low</MenuItem>
                    <MenuItem value="toprated">Avg. Customer Reviews</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product._id}>
                    <Product product={product} />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pages}
                  page={Number(page)}
                  onChange={(event, value) => {
                    navigate(getFilterUrl({ page: value }));
                  }}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
