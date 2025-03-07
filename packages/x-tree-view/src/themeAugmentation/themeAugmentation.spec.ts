import { createTheme } from '@mui/material/styles';
import { treeItemClasses } from '../TreeItem';
import { richTreeViewClasses } from '../RichTreeView';
import { simpleTreeViewClasses } from '../SimpleTreeView';

createTheme({
  components: {
    MuiSimpleTreeView: {
      defaultProps: {
        defaultExpandedItems: ['root'],
        // @ts-expect-error invalid MuiSimpleTreeView prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${simpleTreeViewClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiSimpleTreeView class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiRichTreeView: {
      defaultProps: {
        defaultExpandedItems: ['root'],
        // @ts-expect-error invalid MuiRichTreeView prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${richTreeViewClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiRichTreeView class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiTreeItem: {
      defaultProps: {
        itemId: '1',
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
  },
});
