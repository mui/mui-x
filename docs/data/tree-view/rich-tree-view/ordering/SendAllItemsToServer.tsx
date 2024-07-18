import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

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

const getAllItemsWithChildrenItemIds = (items: TreeViewBaseItem[]) => {
  const itemIds: string[] = [];
  const registerItemId = (item: TreeViewBaseItem) => {
    if (item.children?.length) {
      itemIds.push(item.id);
      item.children.forEach(registerItemId);
    }
  };

  items.forEach(registerItemId);

  return itemIds;
};

export default function SendAllItemsToServer() {
  const apiRefTreeViewA = useTreeViewApiRef();
  const [itemsTreeViewB, setItemsTreeViewB] = React.useState(MUI_X_PRODUCTS);

  const handleItemPositionChangeTreeViewA = () => {
    // We need to wait for the new items to be updated in the state
    setTimeout(() => {
      const newItemsTreeViewA = apiRefTreeViewA.current!.getItemTree();
      setItemsTreeViewB(newItemsTreeViewA);
    });
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeViewPro
          apiRef={apiRefTreeViewA}
          items={MUI_X_PRODUCTS}
          itemsReordering
          defaultExpandedItems={['grid', 'pickers']}
          experimentalFeatures={{
            indentationAtItemLevel: true,
            itemsReordering: true,
          }}
          onItemPositionChange={handleItemPositionChangeTreeViewA}
        />
      </Box>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeViewPro
          items={itemsTreeViewB}
          expandedItems={getAllItemsWithChildrenItemIds(itemsTreeViewB)}
          isItemDisabled={() => true}
        />
      </Box>
    </Stack>
  );
}
