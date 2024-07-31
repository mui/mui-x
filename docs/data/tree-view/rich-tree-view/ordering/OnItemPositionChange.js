import * as React from 'react';
import Box from '@mui/material/Box';

import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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

export default function OnItemPositionChange() {
  const [lastReorder, setLastReorder] = React.useState(null);

  return (
    <Stack spacing={2}>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeViewPro
          items={MUI_X_PRODUCTS}
          itemsReordering
          experimentalFeatures={{
            indentationAtItemLevel: true,
            itemsReordering: true,
          }}
          defaultExpandedItems={['grid', 'pickers']}
          onItemPositionChange={(params) => setLastReorder(params)}
        />
      </Box>
      {lastReorder == null ? (
        <Typography>No reorder registered yet</Typography>
      ) : (
        <Typography>
          Last reordered item: {lastReorder.itemId}
          <br />
          Position before: {lastReorder.oldPosition.parentId ?? 'root'} (index{' '}
          {lastReorder.oldPosition.index})<br />F Position after:{' '}
          {lastReorder.newPosition.parentId ?? 'root'} (index{' '}
          {lastReorder.newPosition.index})
        </Typography>
      )}
    </Stack>
  );
}
