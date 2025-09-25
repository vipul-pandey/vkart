import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderHistoryScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'date', headerName: 'Date', width: 250 },
    { field: 'total', headerName: 'Total', width: 150 },
    { field: 'paid', headerName: 'Paid', width: 150 },
    { field: 'delivered', headerName: 'Delivered', width: 100 },
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
            onClick={() => navigate(`/order/${params.row.id}`)}
            sx={{ mr: 1 }}
          >
            Details
          </Button>
        </>
      ),
    },
  ];
  const rows = orders?.map(order => ({
    id: order._id,
    date: order.createdAt.substring(0, 10),
    total: order.totalPrice.toFixed(2),
    paid: order.isPaid ? order.paidAt.substring(0, 10) : 'No',
    delivered: order.isDelivered
      ? order.deliveredAt.substring(0, 10)
      : 'No',
  })) || [];

  return (
    <Box height="80vh" width="100%" display="flex" flexDirection="column">
      <Helmet>
        <title>Order History</title>
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
        <Typography variant="h4" component="h1">
          Orders
        </Typography>
      </Box>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            hideFooter
            loading={loading}
            sx={{ border: 0 }}
          />
        </Paper>
      )}
    </Box>
  );
};
export default OrderHistoryScreen;
