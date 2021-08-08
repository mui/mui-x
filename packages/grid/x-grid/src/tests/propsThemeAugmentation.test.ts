import { createTheme } from '@material-ui/core';

createTheme({
  props: {
    MuiDataGrid: {
      disableMultipleColumnsFiltering: true,
    },
  },
});
