import React, { useContext, useEffect, useCallback, useReducer } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
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
      console.log('action', action);
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        totalCount: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

const ProductListScreen = () => {
  const [
    {
      loading,
      error,
      products,
      pages,
      page,
      totalCount,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
    totalCount: 0,
  });

  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 10 });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const fetchData = useCallback(async (page, pageSize) => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/products/admin?page=${page + 1}&pageSize=${pageSize}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  }, [userInfo.token]);

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
      fetchData(paginationModel.page, paginationModel.pageSize);
    } else {
      fetchData(paginationModel.page, paginationModel.pageSize);
    }
  }, [userInfo, successDelete, paginationModel, fetchData]);

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('product created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        console.log('product to delete', product);
        await axios.delete(`/api/products/${product.id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'price', headerName: 'Price', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'countInStock', headerName: 'Stock', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/admin/product/${params.row.id}`)}
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

  const rows = products?.map(product => ({
    id: product._id,
    name: product.name,
    price: '₹' + product.price,
    category: product.category,
    brand: product.brand,
    countInStock: product.countInStock,
  })) || [];

  return (
    <Box height="80vh" width="100%" display="flex" flexDirection="column">
      <Helmet><title>Orders</title></Helmet>
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
              Products
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary" type="button" onClick={createHandler}>
              Create Product
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Loading indicators */}
      {loadingCreate && <LoadingBox />}
      {loadingDelete && <LoadingBox />}

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
              rowCount={totalCount}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 15, 20]}
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
export default ProductListScreen;
