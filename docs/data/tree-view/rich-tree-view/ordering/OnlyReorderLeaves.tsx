import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

const ITEMS: TreeViewBaseItem[] = [
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

export default function OnlyReorderLeaves() {
  const apiRef = useTreeViewApiRef();

  return (
    <Box sx={{ height: 220, flexGrow: 1, maxWidth: 400 }}>
      <RichTreeView
        items={ITEMS}
        slots={{ item: TreeItem2 }}
        itemsReordering
        apiRef={apiRef}
        isItemReorderable={(itemId) =>
          apiRef.current!.getItemChildren(itemId).length === 0
        }
        defaultExpandedItems={['grid', 'pickers']}
      />
    </Box>
  );
}
