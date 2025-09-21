import { CircularProgress, Box } from '@mui/material';

const LoadingBox = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  );
};
export default LoadingBox;
