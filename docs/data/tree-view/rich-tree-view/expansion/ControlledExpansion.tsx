import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  TreeViewDefaultItemModelProperties,
  TreeViewItemId,
} from '@mui/x-tree-view/models';
import { MUI_X_PRODUCTS } from '../../datasets/products';

const getAllItemsWithChildrenItemIds = () => {
  const itemIds: TreeViewItemId[] = [];
  const registerItemId = (item: TreeViewDefaultItemModelProperties) => {
    if (item.children?.length) {
      itemIds.push(item.id);
      item.children.forEach(registerItemId);
    }
  };

  MUI_X_PRODUCTS.forEach(registerItemId);

  return itemIds;
};

export default function ControlledExpansion() {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const handleExpandedItemsChange = (
    event: React.SyntheticEvent | null,
    itemIds: string[],
  ) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = () => {
    setExpandedItems((oldExpanded) =>
      oldExpanded.length === 0 ? getAllItemsWithChildrenItemIds() : [],
    );
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleExpandClick}>
          {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      </div>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
        />
      </Box>
    </Stack>
  );
}
