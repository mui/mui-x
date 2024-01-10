import { createTheme } from '@mui/material/styles';
import { treeItemClasses } from '../TreeItem';
import { richTreeViewClasses } from '../RichTreeView';
import { simpleTreeViewClasses } from '../SimpleTreeView';
import { treeViewClasses } from '../TreeView';

createTheme({
  components: {
    MuiSimpleTreeView: {
      defaultProps: {
        defaultExpandedNodes: ['root'],
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
        defaultExpandedNodes: ['root'],
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
    MuiTreeView: {
      defaultProps: {
        defaultExpandedNodes: ['root'],
        // @ts-expect-error invalid MuiTreeView prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${treeViewClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiTreeView class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
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
  },
});
