import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  alpha,
  palette: {
    primary: {
      main: '#6b7280',
      bgColor: '#E5E7EB',
      contrastText: '#000000',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#E5E7EB',
          color: '#374151',
          minHeight: '60px',
          height: '60px',
          justifyContent: 'center',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '48px !important',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#6B7280',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#374151',
          color: '#efe9e9ff',
          '&:hover': {
            backgroundColor: '#6b7280',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#efe9e9ff',
          textDecoration: 'none',
          '&:hover': {
            color: '#efe9e9ff',
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default theme;