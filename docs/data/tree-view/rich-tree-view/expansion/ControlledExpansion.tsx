import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';

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

const getAllItemsWithChildrenItemIds = () => {
  const itemIds: TreeViewItemId[] = [];
  const registerItemId = (item: TreeViewBaseItem) => {
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
    event: React.SyntheticEvent,
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
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleExpandClick}>
          {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      </Box>
      <Box sx={{ minHeight: 200, flexGrow: 1 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
        />
      </Box>
    </Box>
  );
}
