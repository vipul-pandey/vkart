import { Box, Typography, Rating as MuiRating } from '@mui/material';

const Rating = (props) => {
  const { rating, numReviews, caption } = props;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <MuiRating
        value={rating}
        precision={0.5}
        readOnly
        size="small"
        sx={{ color: '#ffc000' }}
      />
      <Typography variant="body2" color="text.secondary">
        {caption ? caption : `${numReviews} reviews`}
      </Typography>
    </Box>
  );
};
export default Rating;
