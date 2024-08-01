import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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

export default function OnlyReorderInSameParent() {
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
        canMoveItemToNewPosition={(params) =>
          params.oldPosition.parentId === params.newPosition.parentId
        }
      />
    </Box>
  );
}
