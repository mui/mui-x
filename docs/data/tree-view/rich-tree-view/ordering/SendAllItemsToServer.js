import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

const getAllItemsWithChildrenItemIds = (items) => {
  const itemIds = [];
  const registerItemId = (item) => {
    if (item.children?.length) {
      itemIds.push(item.id);
      item.children.forEach(registerItemId);
    }
  };

  items.forEach(registerItemId);

  return itemIds;
};

export default function SendAllItemsToServer() {
  const apiRefTreeViewA = useRichTreeViewProApiRef();
  const [itemsTreeViewB, setItemsTreeViewB] = React.useState(MUI_X_PRODUCTS);

  const handleItemPositionChangeTreeViewA = () => {
    // We need to wait for the new items to be updated in the state
    setTimeout(() => {
      const newItemsTreeViewA = apiRefTreeViewA.current.getItemTree();
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
