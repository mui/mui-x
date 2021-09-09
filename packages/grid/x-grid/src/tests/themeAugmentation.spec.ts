import { createTheme } from '@material-ui/core/styles';

createTheme({
  components: {
    MuiDataGrid: {
      defaultProps: {
        disableMultipleColumnsFiltering: true,
      },
    },
  },
});
