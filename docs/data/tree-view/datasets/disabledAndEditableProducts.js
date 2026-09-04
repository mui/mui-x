export const MUI_X_PRODUCTS = [
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
    label: 'Date and Time pickers',
    children: [
      {
        id: 'pickers-community',
        label: '@mui/x-date-pickers',
        disabled: true,
      },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro', editable: true },
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
