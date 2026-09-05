import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function ApiMethodGetItem() {
  const apiRef = useRichTreeViewApiRef();
  const [selectedItem, setSelectedItem] =
    React.useState<TreeViewDefaultItemModelProperties | null>(null);

  const handleSelectedItemsChange = (
    event: React.SyntheticEvent | null,
    itemId: string | null,
  ) => {
    if (itemId == null) {
      setSelectedItem(null);
    } else {
      setSelectedItem(apiRef.current!.getItem(itemId));
    }
  };

  return (
    <Stack spacing={2}>
      <Typography sx={{ minWidth: 300 }}>
        Selected item: {selectedItem == null ? 'none' : selectedItem.label}
      </Typography>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          selectedItems={selectedItem?.id ?? null}
          onSelectedItemsChange={handleSelectedItemsChange}
        />
      </Box>
    </Stack>
  );
}
