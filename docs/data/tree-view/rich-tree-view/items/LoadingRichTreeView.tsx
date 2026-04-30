import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const MUI_X_PRODUCTS: TreeViewDefaultItemModelProperties[] = [
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
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
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

export default function LoadingRichTreeView() {
  const [loading, setLoading] = React.useState(true);

  const handleToggle = () => {
    setLoading((prev) => !prev);
  };

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Button onClick={handleToggle} variant="outlined" size="small" sx={{ alignSelf: 'start' }}>
        {loading ? 'Load items' : 'Reset to loading'}
      </Button>
      <RichTreeView
        loading={loading}
        items={loading ? [] : MUI_X_PRODUCTS}
        sx={{ minHeight: 200 }}
      />
    </Stack>
  );
}
