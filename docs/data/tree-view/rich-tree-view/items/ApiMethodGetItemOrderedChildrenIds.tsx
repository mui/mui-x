import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function ApiMethodGetItemOrderedChildrenIds() {
  const apiRef = useRichTreeViewApiRef();
  const [isSelectedItemLeaf, setIsSelectedItemLeaf] = React.useState<boolean | null>(
    null,
  );

  const handleSelectedItemsChange = (
    event: React.SyntheticEvent | null,
    itemId: string | null,
  ) => {
    if (itemId == null) {
      setIsSelectedItemLeaf(null);
    } else {
      const children = apiRef.current!.getItemOrderedChildrenIds(itemId);
      setIsSelectedItemLeaf(children.length === 0);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography>
        {isSelectedItemLeaf == null && 'No item selected'}
        {isSelectedItemLeaf === true && 'The selected item is a leaf'}
        {isSelectedItemLeaf === false && 'The selected item is a node with children'}
      </Typography>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          onSelectedItemsChange={handleSelectedItemsChange}
        />
      </Box>
    </Stack>
  );
}
