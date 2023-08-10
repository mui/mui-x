import { createTheme } from '@mui/material/styles';
import { treeItemClasses } from '../TreeItem';
import { treeViewClasses } from '../TreeView';

createTheme({
  components: {
    MuiTreeItem: {
      defaultProps: {
        nodeId: '1',
        // @ts-expect-error invalid MuiTreeItem prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${treeItemClasses.content}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiTreeItem class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiTreeView: {
      defaultProps: {
        defaultExpanded: ['root'],
        // @ts-expect-error invalid MuiTreeItem prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${treeViewClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiTreeItem class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});
