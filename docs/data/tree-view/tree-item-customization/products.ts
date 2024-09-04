import { TreeViewBaseItem } from '@mui/x-tree-view/models';

type TreeItemType = {
  id: string;
  label: string;
  disabled?: boolean;
};

export const MUI_X_PRODUCTS: TreeViewBaseItem<TreeItemType>[] = [
  {
    id: 'grid',
    label: 'Data Grid',

    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and time pickers',

    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
        disabled: true,
      },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',

    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];
