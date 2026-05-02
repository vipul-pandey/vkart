import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  alpha,
  palette: {
    primary: {
      main: '#667eea',
      light: '#8b9ff0',
      dark: '#764ba2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f5576c',
      light: '#f7838f',
      dark: '#d63e4d',
    },
    success: {
      main: '#00f2fe',
      light: '#33f7ff',
      dark: '#00b8b8',
    },
    info: {
      main: '#4facfe',
      light: '#7dbfff',
      dark: '#2d6dcc',
    },
    warning: {
      main: '#ffa07a',
      light: '#ffb399',
      dark: '#ff7c4a',
    },
    error: {
      main: '#ff6b6b',
      light: '#ff8a8a',
      dark: '#ff4242',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.3px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          minHeight: '64px',
          height: '64px',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(102, 126, 234, 0.25)',
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px !important',
          height: '64px !important',
          padding: '0 16px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          '& .MuiListItem-root': {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          transition: 'all 300ms ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:disabled': {
            background: '#e0e0e0',
            color: '#999',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: '#ffffff',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(245, 87, 108, 0.3)',
          },
        },
        outlined: {
          borderColor: '#667eea',
          color: '#667eea',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
            borderColor: '#764ba2',
          },
        },
        text: {
          color: '#667eea',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-6px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 300ms ease-in-out',
            '&:hover': {
              borderColor: '#667eea',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#667eea',
          textDecoration: 'none',
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            color: '#764ba2',
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
          color: '#ffffff',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          transition: 'all 300ms ease-in-out',
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 300ms ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
        colorPrimary: {
          color: '#667eea',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.08)',
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-page.Mui-selected': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
          },
        },
      },
    },
  },
});

export default theme;