import React, { useEffect, useReducer, useContext, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper, Avatar, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import axios from '../api/axiosInstance';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        banners: action.payload.banners || action.payload,
        totalCount: action.payload.countBanners || 0,
        page: action.payload.page || 1,
        pages: action.payload.pages || 1,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const BannerListScreen = () => {
  const [{ loading, error, banners, totalCount, page, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    banners: [],
    totalCount: 0,
    page: 1,
    pages: 1,
  });

  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  useEffect(() => {
    const fetchBanners = async (page = 0, pageSize = 10) => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const config = {};
        if (userInfo && userInfo.token) {
          config.headers = { Authorization: `Bearer ${userInfo.token}` };
        }
        const { data } = await axios.get(`/api/banners?page=${page + 1}&pageSize=${pageSize}`, config);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchBanners(paginationModel.page, paginationModel.pageSize);
  }, [userInfo, paginationModel]);

  const deleteHandler = async (row) => {
    try {
      const config = { headers: {} };
      if (userInfo && userInfo.token) config.headers.Authorization = `Bearer ${userInfo.token}`;
      await axios.delete(`/api/banners/${row.id}`, config);
      toast.success('Banner deleted successfully');
      setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'subtitle', headerName: 'Subtitle', width: 300 },
    {
      field: 'image',
      headerName: 'Image',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Avatar src={params.value} variant="rounded" sx={{ width: 80, height: 48 }} />
      ),
    },
    { field: 'isActive', headerName: 'Active', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/admin/banner/${params.row.id}`, { state: { banner: params.row } })}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteHandler(params.row)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const rows = (banners || []).map((b) => ({
    id: b._id,
    title: b.title,
    subtitle: b.subtitle,
    image: b.image,
    isActive: b.isActive ? 'Yes' : 'No',
    ...b,
  }));

  return (
    <Box height="80vh" width="100%" display="flex" flexDirection="column">
      <Helmet>
        <title>Banners</title>
      </Helmet>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'primary.bgColor',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2,
          px: 2,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h4" component="h1">
              Banners
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={() => navigate('/admin/banner/new')}>
              Create Banner
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box flex={1} minHeight={0} px={2} py={2}>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 15, 20]}
              rowCount={totalCount}
              loading={loading}
              sx={{ border: 0 }}
              autoHeight={false}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default BannerListScreen;
