import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function ApiMethodFocusItem() {
  const apiRef = useRichTreeViewApiRef();
  const handleButtonClick = (event) => {
    apiRef.current?.focusItem(event, 'pickers');
  };

  return (
    <Stack spacing={2}>
      <div>
        <Button onClick={handleButtonClick}>Focus pickers item</Button>
      </div>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView items={MUI_X_PRODUCTS} apiRef={apiRef} />
      </Box>
    </Stack>
  );
}
