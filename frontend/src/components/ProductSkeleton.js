import {
  Card,
  CardContent,
  CardActions,
  Skeleton,
  Box,
} from '@mui/material';

const ProductSkeleton = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
      }}
    >
      {/* Image skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        sx={{ animation: 'pulse 1.5s ease-in-out infinite' }}
      />

      {/* Content skeleton */}
      <CardContent sx={{ flex: 1 }}>
        {/* Product name */}
        <Skeleton
          variant="text"
          width="90%"
          height={24}
          sx={{ mb: 1, animation: 'pulse 1.5s ease-in-out infinite' }}
        />

        {/* Product description lines */}
        <Skeleton
          variant="text"
          width="100%"
          height={16}
          sx={{ mb: 0.5, animation: 'pulse 1.5s ease-in-out infinite' }}
        />
        <Skeleton
          variant="text"
          width="85%"
          height={16}
          sx={{ mb: 2, animation: 'pulse 1.5s ease-in-out infinite' }}
        />

        {/* Rating */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="circular"
              width={16}
              height={16}
              sx={{ animation: 'pulse 1.5s ease-in-out infinite' }}
            />
          ))}
        </Box>

        {/* Price */}
        <Skeleton
          variant="text"
          width="50%"
          height={28}
          sx={{ animation: 'pulse 1.5s ease-in-out infinite' }}
        />
      </CardContent>

      {/* Button skeleton */}
      <CardActions>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{ borderRadius: 1, animation: 'pulse 1.5s ease-in-out infinite' }}
        />
      </CardActions>
    </Card>
  );
};

export default ProductSkeleton;
