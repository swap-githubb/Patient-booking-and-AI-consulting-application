import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
      primary: {
        main: '#1976D2',
        light: '#63a4ff',
        dark: '#004ba0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#424242',
        light: '#6d6d6d',
        dark: '#1b1b1b',
        contrastText: '#ffffff',
      },
      background: {
        default: '#f4f6f8',
        paper: '#ffffff',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
      success: {
        main: '#4CAF50',
      },
      error: {
        main: '#F44336',
      },
      info: {
        main: '#2196F3',
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem', color: '#212121' },
      h2: { fontWeight: 700, fontSize: '2.2rem', color: '#212121' },
      h3: { fontWeight: 600, fontSize: '1.8rem', color: '#212121' },
      h4: { fontWeight: 600, fontSize: '1.5rem', color: '#212121' },
      h5: { fontWeight: 600, fontSize: '1.25rem', color: '#212121' },
      h6: { fontWeight: 600, fontSize: '1.1rem', color: '#212121' },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.5px',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        defaultProps: {
            disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
          },
          contained: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }
          }
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
            root: {
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
            }
        }
      },
      MuiAppBar: {
          styleOverrides: {
              root: {
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
              }
          }
      },
      MuiTextField: {
          defaultProps: {
              variant: 'outlined',
              fullWidth: true,
          }
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        `,
      },
    },
});

export const globalStyles = ``;