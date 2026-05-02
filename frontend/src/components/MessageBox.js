import { Alert, Box } from '@mui/material';

const severityMap = {
  danger: 'error',
  warning: 'warning',
  success: 'success',
  info: 'info',
};

export default function MessageBox(props) {
  const severity = severityMap[props.variant] || 'info';
  return (
    <Box
      sx={{
        animation: 'slideInUp 0.3s ease-in-out',
      }}
    >
      <Alert 
        severity={severity}
        sx={{
          borderRadius: '12px',
          boxShadow: 'var(--shadow-md)',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            boxShadow: 'var(--shadow-lg)',
            transform: 'translateY(-2px)',
          },
          backgroundColor: severity === 'error' ? 'rgba(255, 107, 107, 0.1)' : undefined,
          borderColor: severity === 'error' ? '#ff6b6b' : undefined,
        }}
      >
        {props.children}
      </Alert>
    </Box>
  );
}
