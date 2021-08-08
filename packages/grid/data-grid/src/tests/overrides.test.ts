import { createTheme } from '@material-ui/core';

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
});
