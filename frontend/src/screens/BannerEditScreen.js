import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';

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
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

const BannerEditScreen = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id: bannerId } = params;
  const location = useLocation();
  console.log('location', location);
  const passedBanner = location.state && location.state.banner ? location.state.banner : null;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const isCreate = bannerId === 'new';

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [labelText, setLabelText] = useState('');
  const [labelColor, setLabelColor] = useState('#000000');
  const [image, setImage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [isActiveField, setIsActiveField] = useState(true);

  useEffect(() => {
    const initFromPassed = (b) => {
      setTitle(b.title || '');
      setSubtitle(b.subtitle || '');
      setImage(b.image || '');
      setLabelText(b.label?.text || '');
      setLabelColor(b.label?.color || '#000000');
      setCtaText(b.cta?.text || '');
      setCtaLink(b.cta?.link || '');
      setIsActiveField(Boolean(b.isActive));
    };

    if (bannerId === 'new') {
      // creation mode
      dispatch({ type: 'FETCH_SUCCESS' });
      initFromPassed({});
      return;
    }
    if (passedBanner) {
      dispatch({ type: 'FETCH_SUCCESS' });
      initFromPassed(passedBanner);
      return;
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/banners/${bannerId}`);
        initFromPassed(data);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [bannerId, passedBanner]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        subtitle,
        image,
        label: { text: labelText, color: labelColor },
        cta: { text: ctaText, link: ctaLink },
        isActive: isActiveField,
      };
      if (bannerId === 'new') {
        dispatch({ type: 'UPDATE_REQUEST' });
        const { data } = await axios.post('/api/banners', payload, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'UPDATE_SUCCESS' });
        toast.success(data.message || 'Banner created');
        // navigate to edit page for the created banner and pass banner data
        if (data.banner && data.banner._id) {
          navigate(`/admin/banner/${data.banner._id}`, { state: { banner: data.banner } });
        } else {
          navigate('/admin/banners');
        }
      } else {
        dispatch({ type: 'UPDATE_REQUEST' });
        await axios.put(`/api/banners/${bannerId}`, payload, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'UPDATE_SUCCESS' });
        toast.success('Banner updated successfully');
        navigate('/admin/banners');
      }
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadFileHandler = async (e) => {
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
      setImage(data.secure_url);
      toast.success('Image uploaded successfully. click Update to apply it');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  return (
    <Container maxWidth="md">
      <Helmet>
        <title>Edit Banner {bannerId}</title>
      </Helmet>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isCreate ? 'Create Banner' : `Edit Banner ${bannerId}`}
        </Typography>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Box component="form" onSubmit={submitHandler}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Upload Image
              </Typography>
              <input type="file" onChange={uploadFileHandler} style={{ marginBottom: '16px' }} />
              {loadingUpload && <LoadingBox />}
            </Box>

            <TextField
              fullWidth
              label="Label Text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Label Color"
              type="color"
              value={labelColor}
              onChange={(e) => setLabelColor(e.target.value)}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="CTA Text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="CTA Link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              required
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch checked={isActiveField}
                  onChange={(e) => setIsActiveField(e.target.checked)} />
              }
              label="Active"
            />
            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" disabled={loadingUpdate}>
                {isCreate ? 'Create' : 'Update'}
              </Button>
            </Box>
            {loadingUpdate && <LoadingBox />}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BannerEditScreen;
