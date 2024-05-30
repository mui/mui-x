import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

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

const getAllItemItemIds = () => {
  const ids = [];
  const registerItemId = (item) => {
    ids.push(item.id);
    item.children?.forEach(registerItemId);
  };

  MUI_X_PRODUCTS.forEach(registerItemId);

  return ids;
};

export default function ControlledSelection() {
  const [selectedItems, setSelectedItems] = React.useState([]);

  const handleSelectedItemsChange = (event, ids) => {
    setSelectedItems(ids);
  };

  const handleSelectClick = () => {
    setSelectedItems((oldSelected) =>
      oldSelected.length === 0 ? getAllItemItemIds() : [],
    );
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleSelectClick}>
          {selectedItems.length === 0 ? 'Select all' : 'Unselect all'}
        </Button>
      </div>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          selectedItems={selectedItems}
          onSelectedItemsChange={handleSelectedItemsChange}
          multiSelect
        />
      </Box>
    </Stack>
  );
}
