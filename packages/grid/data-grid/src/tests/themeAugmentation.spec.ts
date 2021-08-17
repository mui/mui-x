import { createTheme } from '@material-ui/core/styles';

createTheme({
  overrides: {
    MuiDataGrid: {
      root: {
        backgroundColor: 'red',
      },
      // @ts-expect-error invalid class key
      wrong: {
        display: 'flex',
      },
    },
  },
  props: {
    MuiDataGrid: {
      checkboxSelection: true,
      // @ts-expect-error invalid DataGrid prop
      disableMultipleColumnsFiltering: true,
    },
  },
});
