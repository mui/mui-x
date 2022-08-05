import { createTheme } from '@mui/material/styles';

createTheme({
  components: {
    MuiDatePicker: {
      defaultProps: {
        open: true,
        // @ts-expect-error invalid MuiDatePicker prop
        someRandomProp: true,
      },
    },
  },
});
