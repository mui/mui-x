import { createTheme } from '@material-ui/core';

createTheme({
  props: {
    MuiDataGrid: {
      checkboxSelection: true,
      // @ts-expect-error invalid DataGrid prop
      disableMultipleColumnsFiltering: true,
    },
  },
});
