import { createTheme } from '@material-ui/core/styles';

createTheme({
  components: {
    MuiDataGrid: {
      defaultProps: {
        checkboxSelection: true,
        // @ts-expect-error invalid DataGrid prop
        disableMultipleColumnsFiltering: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid class key
        wrong: {
          display: 'flex',
        },
      },
    },
  },
});
