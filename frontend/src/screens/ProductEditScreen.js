import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
const ProductEditScreen = () => {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. click Update to apply it');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully. click Update to apply it');
  };
  return (
    <Container maxWidth="md">
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Product {productId}
        </Typography>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Box component="form" onSubmit={submitHandler}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Image File"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Upload Image
              </Typography>
              <input
                type="file"
                onChange={uploadFileHandler}
                style={{ marginBottom: '16px' }}
              />
              {loadingUpload && <LoadingBox />}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Additional Images
              </Typography>
              {images.length === 0 && <MessageBox>No image</MessageBox>}
              <List>
                {images.map((x) => (
                  <ListItem key={x} sx={{ border: 1, borderColor: 'grey.300', mb: 1, borderRadius: 1 }}>
                    <ListItemText primary={x} />
                    <IconButton onClick={() => deleteFileHandler(x)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Upload Additional Image
              </Typography>
              <input
                type="file"
                onChange={(e) => uploadFileHandler(e, true)}
                style={{ marginBottom: '16px' }}
              />
              {loadingUpload && <LoadingBox />}
            </Box>

            <TextField
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Count In Stock"
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loadingUpdate}
              sx={{ mt: 3 }}
            >
              Update
            </Button>
            {loadingUpdate && <LoadingBox />}
          </Box>
        )}
      </Paper>
    </Container>
  );
};
export default ProductEditScreen;
