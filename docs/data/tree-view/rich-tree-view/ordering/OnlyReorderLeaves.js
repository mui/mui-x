import * as React from 'react';
import Box from '@mui/material/Box';

import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
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

export default function OnlyReorderLeaves() {
  const apiRef = useTreeViewApiRef();

  return (
    <Box sx={{ minHeight: 352, minWidth: 300 }}>
      <RichTreeViewPro
        items={MUI_X_PRODUCTS}
        itemsReordering
        defaultExpandedItems={['grid', 'pickers']}
        experimentalFeatures={{
          indentationAtItemLevel: true,
          itemsReordering: true,
        }}
        apiRef={apiRef}
        isItemReorderable={(itemId) =>
          apiRef.current.getItemOrderedChildrenIds(itemId).length === 0
        }
      />
    </Box>
  );
}
