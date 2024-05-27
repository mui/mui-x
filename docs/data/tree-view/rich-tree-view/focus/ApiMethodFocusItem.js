import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { useTreeViewApiRef } from '@mui/x-tree-view/hooks/useTreeViewApiRef';

const MUI_X_PRODUCTS = [
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

export default function ApiMethodFocusItem() {
  const apiRef = useTreeViewApiRef();
  const handleButtonClick = (event) => {
    apiRef.current?.focusItem(event, 'pickers');
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleButtonClick}>Focus pickers item</Button>
      </Box>
      <Box sx={{ height: 264, flexGrow: 1 }}>
        <RichTreeView items={MUI_X_PRODUCTS} apiRef={apiRef} />
      </Box>
    </Box>
  );
}
