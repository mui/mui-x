import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';

const ITEMS = Array.from({ length: 10 }).map((_1, index) => ({
  id: `${index}`,
  label: `Item ${index}`,
  children: Array.from({ length: 10 }).map((_2, index2) => ({
    id: `${index}-${index2}`,
    label: `Item ${index}-${index2}`,
    children: Array.from({ length: 10 }).map((_3, index3) => ({
      id: `${index}-${index2}-${index3}`,
      label: `Item ${index}-${index2}-${index3}`,
      children: Array.from({ length: 10 }).map((_4, index4) => ({
        id: `${index}-${index2}-${index3}-${index4}`,
        label: `Item ${index}-${index2}-${index3}-${index4}`,
      })),
    })),
  })),
}));

function addChildrenToItem(item: TreeViewBaseItem): TreeViewItemId[] {
  return [item.id, ...(item.children ?? []).flatMap(addChildrenToItem)];
}

const flatItemIds = ITEMS.flatMap(addChildrenToItem);

export default function Virtualization() {
  return (
    <Box sx={{ height: 352, minWidth: 250 }}>
      <RichTreeViewPro
        items={ITEMS}
        experimentalFeatures={{ virtualization: true }}
        defaultExpandedItems={flatItemIds}
        slots={{ item: TreeItem2 }}
      />
    </Box>
  );
}
