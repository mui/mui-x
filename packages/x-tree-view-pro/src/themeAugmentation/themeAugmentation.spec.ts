import { createTheme } from '@mui/material/styles';
import { richTreeViewProClasses } from '../RichTreeViewPro';

createTheme({
  components: {
    MuiRichTreeViewPro: {
      defaultProps: {
        defaultExpandedItems: ['root'],
        // @ts-expect-error invalid MuiRichTreeViewPro prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${richTreeViewProClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiRichTreeViewPro class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});
