import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function ApiMethodSetItemExpansion() {
  const apiRef = useRichTreeViewApiRef();

  const handleExpandClick = (event) => {
    apiRef.current.setItemExpansion({
      event,
      itemId: 'grid',
      shouldBeExpanded: true,
    });
  };

  const handleCollapseClick = (event) => {
    apiRef.current.setItemExpansion({
      event,
      itemId: 'grid',
      shouldBeExpanded: false,
    });
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={2} direction="row">
        <Button onClick={handleExpandClick}>Expand Data Grid</Button>
        <Button onClick={handleCollapseClick}>Collapse Data Grid</Button>
      </Stack>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView items={MUI_X_PRODUCTS} apiRef={apiRef} />
      </Box>
    </Stack>
  );
}
