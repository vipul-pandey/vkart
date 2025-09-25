import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { Button, Box, Paper, Typography } from '@mui/material';
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
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function UserListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
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
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'isAdmin', headerName: 'IsAdmin', width: 150 },
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
            onClick={() => navigate(`/admin/user/${params.row.id}`)}
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
  const rows = users?.map(user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin ? 'YES' : 'NO',
  })) || [];

  return (
    <Box height="80vh" width="100%" display="flex" flexDirection="column">
      <Helmet> <title>Users</title></Helmet>
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'primary.bgColor',
        borderBottom: 1,
        borderColor: 'divider',
        py: 2,
        px: 2,
      }}>
        <Typography variant="h4" component="h1">
          Users
        </Typography>
      </Box>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
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
}
