import { CircularProgress, Box } from '@mui/material';

const LoadingBox = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: 3,
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <CircularProgress 
        sx={{
          color: '#667eea',
          animation: 'spin 1s linear infinite',
        }}
      />
    </Box>
  );
};
export default LoadingBox;
