import { TreeViewBaseItem } from '@mui/x-tree-view/models';

type ExtendedTreeItemProps = {
  editable?: boolean;
  id: string;
  label: string;
};

export const MUI_X_PRODUCTS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    editable: true,
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid', editable: true },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro', editable: true },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium', editable: true },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and time pickers',
    editable: true,
    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
        editable: true,
      },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro', editable: true },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    editable: true,
    children: [{ id: 'charts-community', label: '@mui/x-charts', editable: true }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view', editable: true }],
    editable: true,
  },
];
