import { createTheme } from '@material-ui/core/styles';

createTheme({
  props: {
    MuiXGrid: {
      disableMultipleColumnsFiltering: true,
    },
  },
});
