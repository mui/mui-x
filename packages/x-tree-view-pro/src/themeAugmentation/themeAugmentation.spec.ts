import { createTheme } from '@mui/material/styles';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { simpleTreeViewClasses } from '@mui/x-tree-view/SimpleTreeView';
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
    MuiTreeItem: {
      defaultProps: {
        color: 'primary',
        // @ts-expect-error invalid MuiTreeItem prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${treeItemClasses.label}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiTreeItem class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiSimpleTreeView: {
      defaultProps: {
        defaultValue: '1',
        // @ts-expect-error invalid MuiSimpleTreeView prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${simpleTreeViewClasses.itemCheckbox}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiSimpleTreeView class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});
