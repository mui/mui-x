import type {} from '@mui/x-data-grid-premium/themeAugmentation';
import { createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';

export const inventoryTheme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
  colorSchemes: {
    light: {
      palette: {
        DataGrid: {
          headerBg: blueGrey[50],
        },
      },
    },
    dark: {
      palette: {
        DataGrid: {
          headerBg: blueGrey[900],
        },
      },
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        cell: {
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.875rem',
          '&:focus, &:focus-within': {
            outline: 'none',
          },
        },
        toolbar: ({ theme }) => ({
          backgroundColor: grey[50],
          ...theme.applyStyles('dark', {
            backgroundColor: grey[900],
          }),
        }),
        footerContainer: ({ theme }) => ({
          backgroundColor: grey[50],
          ...theme.applyStyles('dark', {
            backgroundColor: grey[900],
          }),
        }),
      },
    },
  },
});
