import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <Box component="form" onSubmit={submitHandler} sx={{ width: '100%', maxWidth: 400 }}>
      <TextField
        fullWidth
        size="small"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" edge="end">
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBox;
