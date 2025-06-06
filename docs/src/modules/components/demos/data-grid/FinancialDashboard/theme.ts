import type {} from '@mui/x-data-grid-premium/themeAugmentation';
import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

export const stockDashboardTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        DataGrid: {
          headerBg: grey[50],
        },
      },
    },
    dark: {
      palette: {
        DataGrid: {
          headerBg: grey[900],
        },
      },
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
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
