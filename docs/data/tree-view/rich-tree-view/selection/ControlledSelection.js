import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { MUI_X_PRODUCTS } from '../../datasets/products';

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
