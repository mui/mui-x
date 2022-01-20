import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiDataGrid: {
      defaultProps: {
        disableMultipleColumnsFiltering: true,
      },
    },
  },
});
