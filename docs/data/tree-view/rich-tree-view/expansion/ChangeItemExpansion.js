import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

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
];

export default function ChangeItemExpansion() {
  const apiRef = useTreeViewApiRef();

  const handleExpandClick = (event) => {
    apiRef.current.setItemExpansion(event, 'grid', true);
  };

  const handleCollapseClick = (event) => {
    apiRef.current.setItemExpansion(event, 'grid', false);
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Stack sx={{ mb: 1 }} spacing={2} direction="row">
        <Button onClick={handleExpandClick}>Expand Data Grid</Button>
        <Button onClick={handleCollapseClick}>Collapse Data Grid</Button>
      </Stack>
      <Box sx={{ minHeight: 220, flexGrow: 1 }}>
        <RichTreeView items={MUI_X_PRODUCTS} apiRef={apiRef} />
      </Box>
    </Box>
  );
}
